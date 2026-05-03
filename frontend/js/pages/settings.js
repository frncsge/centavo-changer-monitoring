import { enableTOTP, verifyTOTP } from "../auth/mfa.js";

let totpFactorId = null;

document.getElementById("enable-totp").addEventListener("click", async () => {
  document.getElementById("TOTP-modal-backdrop").style.display = "block";

  const result = await enableTOTP();

  if (result.error) return console.error(result.error);

  totpFactorId = result.totpFactorId;

  document.getElementById("qr-code").src = result.qrCode;
});

document
  .getElementById("TOTP-modal-backdrop")
  .addEventListener("click", async (e) => {
    const id = e.target.id;

    // close modal
    if (id === "TOTP-modal-backdrop") {
      document.getElementById("TOTP-modal-backdrop").style.display = "none";
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
    }

    // NEXT
    if (id === "next-btn") {
      document.getElementById("TOTP-qr-section").style.display = "none";
      document.getElementById("TOTP-code-section").style.display = "flex";
    }

    // PREV
    if (id === "prev-btn") {
      document.getElementById("TOTP-qr-section").style.display = "flex";
      document.getElementById("TOTP-code-section").style.display = "none";
    }
  });
