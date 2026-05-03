import supabase from "../../../config/supabaseConfig.js";

export async function enableTOTP() {
  // enable MFA using TOTP
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
  });

  if (error) return { error };

  // return qr code and data id
  return { qrCode: data?.totp?.qr_code, totpFactorId: data.id };
}

export async function verifyTOTP(code, totpFactorId) {
  const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
    factorId: totpFactorId,
    code,
  });

  if (verifyError) {
    return { error: verifyError };
  }

  return { success: true };
}
