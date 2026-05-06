import supabase from "../../../config/supabaseConfig.js";
import { enableTOTP, verifyTOTP } from "../auth/mfa.js";
import { checkUserAuth } from "../auth/session.js";
import { hidePageLoadingOverlay } from "../ui/pageLoadingOverlay.js";

const enableTOTPbtn = document.getElementById("enable-totp-btn");

window.addEventListener("DOMContentLoaded", async () => {
  // check if user is logged in
  const isLoggedIn = await checkUserAuth();

  if (!isLoggedIn) {
    window.location.href = "http://127.0.0.1:5501/frontend/html/login.html";
  }

  // check if TOTP is already enabled
  const factorId = await checkTOTPenabled();

  // remove loading once user is proven to be logged in
  hidePageLoadingOverlay();

  // when user clicks enable TOTP button
  let totpFactorId = null;
  enableTOTPbtn.addEventListener("click", async () => {
    if (factorId) {
      const confirmed = confirm(
        "Are you sure you want to disable two-factor authentication? Your account will be less secure.",
      );

      if (!confirmed) return;

      const { error: unenrollError } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (unenrollError) {
        alert(unenrollError.message);
        return;
      }

      alert("TOTP disabled successfully!");
      window.location.reload();
      return;
    }

    const confirmed = confirm(
      "Set up two-factor authentication using an authenticator app?",
    );

    if (!confirmed) return;

    document.getElementById("TOTP-modal-backdrop").style.display = "block";

    const uniqueName = `Changetavo MFA ${Date.now()}-${Math.random()}`;

    // enroll new factor
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: uniqueName,
    });

    if (error) {
      // if error, hide totp-qr-section
      document.getElementById("TOTP-qr-section").style.display = "none";
      return;
    }

    totpFactorId = data.id;
    const qrCode = data.totp.qr_code;
    document.getElementById("qr-code").src = qrCode;
  });

  // event listeners for elements inside the TOTP-modal-backdrop
  document
    .getElementById("TOTP-modal-backdrop")
    .addEventListener("click", async (e) => {
      const id = e.target.id;

      // close modal
      if (id === "TOTP-modal-backdrop") {
        const confirmed = confirm(
          "Exit TOTP setup? Your account won’t be protected with 2FA until you finish.",
        );

        if (confirmed) {
          document.getElementById("TOTP-modal-backdrop").style.display = "none";
        }
      }

      // VERIFY OTP
      if (id === "verify-otp-btn") {
        const code = document.getElementById("TOTP-code-input").value;

        const result = await verifyTOTP(code, totpFactorId);

        if (result.error) {
          alert(result.error.message);
          return;
        }

        alert("MFA enabled!");
        document.getElementById("TOTP-modal-backdrop").style.display = "none";
        window.location.reload();
      }
    });
});

async function checkTOTPenabled() {
  // ===> check if TOTP is already enabled <===
  const { data, error } = await supabase.auth.mfa.listFactors();

  if (error) {
    console.error(error.message);
    return;
  }

  const isTOTPenabled = data.totp.length > 0;

  const enableTOTPbtn = document.getElementById("enable-totp-btn");
  isTOTPenabled
    ? (enableTOTPbtn.textContent = "Disable TOTP")
    : (enableTOTPbtn.textContent = "Enable TOTP");

  return data.totp?.[0]?.id;
}
