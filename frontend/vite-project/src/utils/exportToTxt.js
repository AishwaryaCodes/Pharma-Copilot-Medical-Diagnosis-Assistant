export const exportDiagnosisAsTxt = (result) => {
    if (!result) return;
  
    const content = `
  Patient Name: ${result.name}
  Age: ${result.age}
  
  🫀 Cardiologist Result:
  ${result.cardiologist_result || "N/A"}
  
  🧠 Psychologist Result:
  ${result.psychologist_result || "N/A"}
  
  🫁 Pulmonologist Result:
  ${result.pulmonologist_result || "N/A"}
  
  🧾 Final Diagnosis:
  ${result.final_diagnosis || "N/A"}
    `.trim();
  
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = `${result.name}_Diagnosis.txt`;
    a.click();
  
    URL.revokeObjectURL(url);
  };
  