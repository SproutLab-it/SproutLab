interface DisclaimerProps {
  variant?: "inline" | "footer" | "results";
}

export function Disclaimer({ variant = "inline" }: DisclaimerProps) {
  if (variant === "footer") {
    return <footer className="mt-auto bg-[#2E1B12] py-2" />;
  }

  if (variant === "results") {
    return (
      <div className="border border-[#2E1B12]/10 bg-[#FCFCF7] p-4 mb-6">
        <p className="text-sm text-[#9C8B78]">
          <strong className="text-[#2E1B12]">Important:</strong> This plan is for educational purposes only and does not constitute medical advice. Consult a physician before making changes to your supplement regimen.
        </p>
      </div>
    );
  }

  return (
    <p className="text-xs text-[#9C8B78] italic">
      Educational purposes only. Not medical advice. Consult a physician.
    </p>
  );
}
