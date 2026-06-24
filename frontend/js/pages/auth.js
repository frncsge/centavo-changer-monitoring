import supabase from "../../../config/supabaseClient.js";

window.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("verify-otp-btn")
    .addEventListener("click", async () => {
      const code = document.getElementById("totp-code-input").value;

      if (!code) {
        alert("Input 6-digit code from your authenticator app");
        return;
      }

      // get factor id
      const { data, error } = await supabase.auth.mfa.listFactors();

      if (error) {
        alert(error);
        return;
      }

      const factorId = data.totp?.[0]?.id;

      const { data: challengeData, error: challengeError } =
        await supabase.auth.mfa.challenge({ factorId });

      if (challengeError) {
        alert(challengeError);
        return;
      }

      const { data: verifyData, error: verifyError } =
        await supabase.auth.mfa.verify({
          factorId,
          challengeId: challengeData.id,
          code,
        });

      if (verifyError) {
        alert(verifyError);
        return;
      }

      window.location.href =
        "/html/dashboard.html";
    });
});
