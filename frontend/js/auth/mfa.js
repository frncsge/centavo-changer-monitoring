import supabase from "/config/supabaseClient.js";

export async function enableTOTP() {
  const { data: factors, error: listError } =
    await supabase.auth.mfa.listFactors();

  if (listError) return { error: listError };

  const unverified = factors.totp?.find((f) => f.status !== "verified");

  // If orphan/unverified exists, delete first
  if (unverified) {
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({
      factorId: unverified.id,
    });
    if (unenrollError) return { error: unenrollError };
  }

  // safely enroll fresh
  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: "totp",
  });

  if (error) return { error };

  return {
    qrCode: data?.totp?.qr_code,
    totpFactorId: data.id,
  };
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
