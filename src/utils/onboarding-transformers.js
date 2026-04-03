/**
 * Data transformation functions for onboarding form
 * Converts form data to API-compatible format
 */

/**
 * Transform Processing Information data
 */
export const transformProcessingInformationData = (formData) => {
  console.log("🔍 Processing Information - Raw Form Data:", formData);

  const data = {
    adjustment_of_status: formData.adjustment_of_status,
  };

  if (formData.adjustment_of_status) {
    // If adjustment of status is true
    data.date_of_last_entry = formData.date_of_last_entry;
    data.i944_number = formData.i944_number;
  } else {
    // If adjustment of status is false (consular processing)
    data.embassy_name = formData.embassy_name;
    data.embassy_location = formData.embassy_location;
  }

  // Add applicant visa records if they exist
  if (formData.visa_records?.length > 0) {
    data.visa_records = formData.visa_records.map((record) => ({
      first_name: record.visa_first_name || "",
      middle_name: record.visa_middle_name || "",
      last_name: record.visa_last_name || "",
      type: String(record.type || ""),
      expedition_date: record.expedition_date || "",
      expiration_date: record.expiration_date || "",
    }));
    console.log(
      "📤 Applicant Visa Records Payload:",
      JSON.stringify(data.visa_records, null, 2),
    );
  }

  // Add dependents with their nested visa records
  if (formData.dependents?.length > 0) {
    console.log("🔍 Raw formData.dependents:", formData.dependents);
    console.log(
      "🔍 First dependent academic_records:",
      formData.dependents[0]?.academic_records,
    );

    data.dependents = formData.dependents.map((dependent, index) => {
      const academicRecords = dependent.academic_records;
      console.log(
        `🔍 Dependent ${index} academic_records structure:`,
        academicRecords,
      );

      const transformedDependent = {
        first_name: dependent.first_name || "",
        middle_name: dependent.middle_name || "",
        last_name: dependent.last_name || "",
        dob: dependent.dob || "",
        relation: dependent.relation || "",
        country_of_birth: String(dependent.country_of_birth || ""),
        country_of_citizenship: String(dependent.country_of_citizenship || ""),
        education: dependent.education || "",
        visa_records:
          dependent.visa_records?.length > 0
            ? dependent.visa_records.map((visa) => ({
                first_name: dependent.first_name || "",
                middle_name: dependent.middle_name || "",
                last_name: dependent.last_name || "",
                type: String(visa.type || ""),
                expedition_date: visa.expedition_date || "",
                expiration_date: visa.expiration_date || "",
              }))
            : [],
      };

      // Only add academic_records if education is selected and fields are filled
      if (
        dependent.education &&
        dependent.education !== "none" &&
        dependent.education !== "" &&
        academicRecords &&
        (academicRecords.program_name || academicRecords.institution_name)
      ) {
        transformedDependent.academic_records = [
          {
            program_name: academicRecords.program_name || "",
            institution_name: academicRecords.institution_name || "",
            graduation_year: academicRecords.graduation_year || "",
            grade: academicRecords.grade || "",
            country: String(academicRecords.country || ""),
            state: academicRecords.state || "",
            city: academicRecords.city || "",
            zip_code: academicRecords.zip_code || "",
            address: academicRecords.address || "",
          },
        ];
        console.log(
          `🔍 Dependent ${index} transformed academic_records:`,
          transformedDependent.academic_records,
        );
      }

      return transformedDependent;
    });

    console.log(
      "📤 Final transformed dependents:",
      JSON.stringify(data.dependents, null, 2),
    );
  }

  console.log("📤 Processing Information - Transformed API Data:", data);
  return data;
};

/**
 * Transform Main Applicant data
 */
export const transformMainApplicantData = (formData, profile) => {
  const transformedData = {
    first_name: formData.firstName,
    middle_name: formData.middleName || "",
    last_name: formData.lastName,
    dob: formData.dob,
    gender: formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1),
    country_of_birth: formData.countryOfBirth,
    country_of_citizenship: formData.citizenship1,
    country_of_citizenship2: formData.citizenship2 || "",
    current_country: formData.country,
    current_state: formData.state,
    current_city: formData.city,
    current_zip_code: formData.zipCode || "",
    current_address: formData.address,
    personal_email: formData.email,
    phone_number: formData.phone,
    legally_married:
      formData.maritalStatus === "Married"
        ? "Yes"
        : formData.maritalStatus === "Unmarried"
          ? "No"
          : formData.maritalStatus,
    legally_married_if_others:
      formData.maritalStatus &&
      !["Married", "Unmarried", "Divorced", "Widow", "Separated"].includes(
        formData.maritalStatus,
      )
        ? formData.clarifyMaritalStatus || ""
        : "",
    legally_married_if_d_w_s: ["Divorced", "Widow", "Separated"].includes(
      formData.maritalStatus,
    )
      ? formData.clarifyMaritalStatus || ""
      : "",
    legally_married_if_yes_country:
      formData.maritalStatus === "Married"
        ? formData.countryOfMarriage || ""
        : "",
    legally_married_if_yes_date_of_marriage:
      formData.maritalStatus === "Married" ? formData.dateOfMarriage || "" : "",
  };

  console.log("📤 Main Applicant - Sending to API:", transformedData);

  // ⚠️ TEMPORARY: Save marital data to localStorage as backup
  if (profile?.id) {
    if (formData.maritalStatus) {
      localStorage.setItem(
        `maritalStatus_${profile.id}`,
        formData.maritalStatus,
      );
    }
    if (formData.clarifyMaritalStatus) {
      localStorage.setItem(
        `clarifyMaritalStatus_${profile.id}`,
        formData.clarifyMaritalStatus,
      );
    }
    if (formData.countryOfMarriage) {
      localStorage.setItem(
        `countryOfMarriage_${profile.id}`,
        formData.countryOfMarriage.toString(),
      );
    }
    if (formData.dateOfMarriage) {
      localStorage.setItem(
        `dateOfMarriage_${profile.id}`,
        formData.dateOfMarriage,
      );
    }
  }

  return transformedData;
};

/**
 * Transform Current Address data
 */
export const transformCurrentAddressData = (formData) => ({
  current_country: formData.country,
  current_state: formData.state,
  current_city: formData.city,
  current_zip_code: formData.zipCode || "",
  current_address: formData.address,
});

/**
 * Transform Contact Details data
 */
export const transformContactDetailsData = (formData) => ({
  personal_email: formData.email,
  phone_number: formData.phone,
});

/**
 * Transform Academic data
 */
export const transformAcademicData = (formData) => {
  console.log("🔍 Full formData:", formData);
  console.log("🔍 hasFormalEducation:", formData.hasFormalEducation);

  // If no formal education, return empty array
  if (!formData.hasFormalEducation) {
    return { has_formal_education: false, academic_records: [] };
  }

  const academicLevels = [
    "lowerSchool",
    "highSchool",
    "bachelor",
    "graduate",
    "doctorate",
  ];

  // Log each level's value
  academicLevels.forEach((level) => {
    console.log(`🔍 ${level}:`, formData[level]);
  });

  const academic_records = academicLevels
    .filter((level) => {
      const isYes = formData[level]?.toLowerCase() === "yes";
      console.log(
        `🔍 Filtering ${level}: ${formData[level]} === "yes"? ${isYes}`,
      );
      return isYes;
    })
    .map((level) => ({
      program_name: level,
      institution_name: formData[`${level}_instituteName`] || "",
      graduation_year: formData[`${level}_graduationYear`] || "",
      country: formData[`${level}_country`] || "",
      state: formData[`${level}_state`] || "",
      city: formData[`${level}_city`] || "",
      zip_code: formData[`${level}_zipCode`] || "",
      address: formData[`${level}_address`] || "",
      ...(level === "lowerSchool" && {
        grade: formData.lowerSchool_grade || "",
      }),
    }));

  console.log("📤 Final academic_records:", academic_records);
  return { has_formal_education: true, academic_records };
};

/**
 * Transform English Proficiency data
 */
export const transformEnglishProficiencyData = (formData) => ({
  english_proficiency_listening:
    formData.listening === "Advanced" ? "Advance" : formData.listening,
  english_proficiency_reading:
    formData.reading === "Advanced" ? "Advance" : formData.reading,
  english_proficiency_writing:
    formData.writing === "Advanced" ? "Advance" : formData.writing,
  english_proficiency_speaking:
    formData.speaking === "Advanced" ? "Advance" : formData.speaking,
});

/**
 * Transform Work Experience data
 */
export const transformWorkExperienceData = (formData) => {
  // If user selected "No", return empty array
  if (formData.has_work_experience === "No") {
    return { work_experiences: [] };
  }

  const work_experiences = (formData.work_experiences || []).map((exp) => ({
    company_name: exp.company_name || "",
    job_title: exp.job_title || "",
    job_desc: exp.job_description || "",
    job_duty: exp.job_duty || "",
    supervisor_name: exp.supervisor_name || "",
    start_date: exp.start_date || "",
    end_date: exp.end_date || "",
    current: exp.currently_employed || false,
    city: exp.city || "",
    state: exp.state || "",
    zip_code: exp.zip_code || "",
  }));

  return { work_experiences };
};

/**
 * Transform Dependent data
 */
export const transformDependentData = (formData) => {
  // If user selected "No", return empty array
  if (formData.has_dependents === "No") {
    return { dependents: [] };
  }

  const dependents = (formData.dependents || []).map((dependent) => ({
    first_name: dependent.first_name || "",
    middle_name: dependent.middle_name || null,
    last_name: dependent.last_name || "",
    dob: dependent.dob || "",
    relation: dependent.kinship || "",
    country_of_birth: dependent.birth_country
      ? parseInt(dependent.birth_country, 10)
      : null,
    country_of_citizenship: dependent.citizenship_country
      ? parseInt(dependent.citizenship_country, 10)
      : null,
    education: dependent.highest_level_of_education || null,
  }));
  return { dependents };
};

/**
 * Transform Marital Status data
 */
export const transformMaritalStatusData = (formData) => {
  const status = formData.maritalStatus || "";

  return {
    legally_married: status === "Yes" ? "Yes" : status === "No" ? "No" : status,
    legally_married_if_others:
      status &&
      !["Yes", "No", "Divorced", "Widow", "Separated"].includes(status)
        ? formData.clarifyMaritalStatus || ""
        : "",
    legally_married_if_d_w_s: ["Divorced", "Widow", "Separated"].includes(
      status,
    )
      ? formData.clarifyMaritalStatus || ""
      : "",
    legally_married_if_yes_country:
      status === "Yes" ? formData.countryOfMarriage || "" : "",
    legally_married_if_yes_date_of_marriage:
      status === "Yes" ? formData.dateOfMarriage || "" : "",
  };
};

/**
 * Transform Emergency Contact data
 */
export const transformEmergencyContactData = (formData) => {
  const kinship = formData.degreeOfKinship || "";

  return {
    eci_degree_of_kinship: kinship === "Other" ? "Other" : kinship,
    eci_degree_of_kinship_other:
      kinship === "Other" ? formData.degreeOfKinshipOther || "" : "",
    eci_first_name: formData.emergencyFirstName || "",
    eci_middle_name: formData.emergencyMiddleName || "",
    eci_last_name: formData.emergencyLastName || "",
    eci_phone: formData.emergencyPhone || "",
    eci_address: formData.emergencyAddress || "",
  };
};

/**
 * Transform Visa Rejection data
 */
export const transformVisaRejectionData = (formData) => {
  const visa_rejections = [];

  // Add employee rejection if Yes
  if (formData.employee_visa_rejected === "Yes") {
    visa_rejections.push({
      rejected_for: "Employee",
      first_name: formData.visa_rejections_employee_first_name || "",
      middle_name: formData.visa_rejections_employee_middle_name || "",
      last_name: formData.visa_rejections_employee_last_name || "",
      visa: formData.employee_visa_type || "",
      reason: formData.employee_rejection_reason || "",
      date: formData.employee_rejection_date || "",
    });
  }

  // Add dependent rejection if Yes
  if (formData.dependents_visa_rejected === "Yes") {
    visa_rejections.push({
      rejected_for: "Dependent",
      first_name: formData.visa_rejections_dependent_first_name || "",
      middle_name: formData.visa_rejections_dependent_middle_name || "",
      last_name: formData.visa_rejections_dependent_last_name || "",
      visa: formData.dependent_visa_type || "",
      reason: formData.dependent_rejection_reason || "",
      date: formData.dependent_rejection_date || "",
    });
  }

  return {
    employee_visa_rejected: formData.employee_visa_rejected,
    dependents_visa_rejected: formData.dependents_visa_rejected,
    visa_rejections,
  };
};

/**
 * Transform Immigration Incident data
 */
export const transformImmigrationIncidentData = (formData) => {
  const data = {
    immigration_incidents: {
      e_overstayed_usa_visa_i94_employee:
        formData.e_overstayed_usa_visa_i94_employee === "yes" ? "Yes" : "No",
      e_overstayed_usa_visa_i94_dependents:
        formData.e_overstayed_usa_visa_i94_dependents === "yes" ? "Yes" : "No",
      eb_unlawfully_present_usa_employee:
        formData.eb_unlawfully_present_usa_employee === "yes" ? "Yes" : "No",
      eb_unlawfully_present_usa_dependents:
        formData.eb_unlawfully_present_usa_dependents === "yes" ? "Yes" : "No",
      eb_denied_entry_usa_employee:
        formData.eb_denied_entry_usa_employee === "yes" ? "Yes" : "No",
      eb_denied_entry_usa_dependents:
        formData.eb_denied_entry_usa_dependents === "yes" ? "Yes" : "No",
      eb_deported_from_any_country_employee:
        formData.eb_deported_from_any_country_employee === "yes" ? "Yes" : "No",
      eb_deported_from_any_country_dependents:
        formData.eb_deported_from_any_country_dependents === "yes"
          ? "Yes"
          : "No",
      ebb_imr_judge_h_ofcr_employee:
        formData.ebb_imr_judge_h_ofcr_employee === "yes" ? "Yes" : "No",
      ebb_imr_judge_h_ofcr_dependents:
        formData.ebb_imr_judge_h_ofcr_dependents === "yes" ? "Yes" : "No",
    },
  };

  // Only add employee overstayed fields if yes
  if (formData.e_overstayed_usa_visa_i94_employee === "yes") {
    data.immigration_incidents.e_overstayed_usa_visa_employee_if_yes_from =
      formData.e_overstayed_usa_visa_employee_if_yes_from || "";
    data.immigration_incidents.e_overstayed_usa_visa_employee_if_yes_to =
      formData.e_overstayed_usa_visa_employee_if_yes_to || "";
  }

  // Only add dependent overstayed fields if yes
  if (formData.e_overstayed_usa_visa_i94_dependents === "yes") {
    data.immigration_incidents.e_overstayed_usa_visa_i94_dependents_if_yes_who =
      formData.e_overstayed_usa_visa_i94_dependents_if_yes_who || "";
    data.immigration_incidents.e_overstayed_usa_visa_i94_dependents_from =
      formData.e_overstayed_usa_visa_i94_dependents_from || "";
    data.immigration_incidents.e_overstayed_usa_visa_i94_dependents_to =
      formData.e_overstayed_usa_visa_i94_dependents_to || "";
  }

  // Only add employee unlawfully present fields if yes
  if (formData.eb_unlawfully_present_usa_employee === "yes") {
    data.immigration_incidents.eb_unlawfully_present_usa_employee_from =
      formData.eb_unlawfully_present_usa_employee_from || "";
    data.immigration_incidents.eb_unlawfully_present_usa_employee_to =
      formData.eb_unlawfully_present_usa_employee_to || "";
  }

  // Only add dependent unlawfully present fields if yes
  if (formData.eb_unlawfully_present_usa_dependents === "yes") {
    data.immigration_incidents.eb_unlawfully_present_usa_dependents_if_yes_who =
      formData.eb_unlawfully_present_usa_dependents_if_yes_who || "";
    data.immigration_incidents.eb_unlawfully_present_usa_dependents_from =
      formData.eb_unlawfully_present_usa_dependents_from || "";
    data.immigration_incidents.eb_unlawfully_present_usa_dependents_to =
      formData.eb_unlawfully_present_usa_dependents_to || "";
  }

  // Only add employee denied entry fields if yes
  if (formData.eb_denied_entry_usa_employee === "yes") {
    data.immigration_incidents.eb_denied_entry_usa_employee_if_yes =
      formData.eb_denied_entry_usa_employee_if_yes || "";
  }

  // Only add dependent denied entry fields if yes
  if (formData.eb_denied_entry_usa_dependents === "yes") {
    data.immigration_incidents.eb_denied_entry_usa_dependents_if_yes =
      formData.eb_denied_entry_usa_dependents_if_yes || "";
  }

  // Only add employee deported fields if yes
  if (formData.eb_deported_from_any_country_employee === "yes") {
    data.immigration_incidents.eb_deported_from_any_country_employee_if_yes =
      formData.eb_deported_from_any_country_employee_if_yes || "";
  }

  // Only add dependent deported fields if yes
  if (formData.eb_deported_from_any_country_dependents === "yes") {
    data.immigration_incidents.eb_deported_from_any_country_dependents_if_yes =
      formData.eb_deported_from_any_country_dependents_if_yes || "";
  }

  // Only add employee immigration judge fields if yes
  if (formData.ebb_imr_judge_h_ofcr_employee === "yes") {
    data.immigration_incidents.ebb_imr_judge_h_ofcr_employee_if_yes =
      formData.ebb_imr_judge_h_ofcr_employee_if_yes || "";
  }

  // Only add dependent immigration judge fields if yes
  if (formData.ebb_imr_judge_h_ofcr_dependents === "yes") {
    data.immigration_incidents.ebb_imr_judge_h_ofcr_dependents_if_yes =
      formData.ebb_imr_judge_h_ofcr_dependents_if_yes || "";
  }

  return data;
};

/**
 * Transform Criminal Record data
 */
export const transformCriminalRecordData = (formData) => {
  // If both employee and dependents selected "No", return empty array
  if (
    formData.criminal_record_employee === "No" &&
    formData.criminal_record_dependents === "No"
  ) {
    return {
      criminal_record_employee: formData.criminal_record_employee,
      criminal_record_dependents: formData.criminal_record_dependents,
      criminal_records: [],
    };
  }

  return {
    criminal_record_employee: formData.criminal_record_employee,
    criminal_record_dependents: formData.criminal_record_dependents,
    criminal_records: formData.criminal_records?.length
      ? formData.criminal_records.map((r) => {
          const record = {
            related_to: r.related_to,
            name: r.name,
            type_of_record: r.type_of_record,
            date: r.date,
            outcome: r.outcome,
          };
          // Only include dependent_id if related_to is dependent
          if (r.related_to === "dependent" && r.dependent_id) {
            record.dependent_id = r.dependent_id;
          }
          return record;
        })
      : [],
  };
};

/**
 * Transform Inadmissibility data
 */
export const transformInadmissibilityData = (formData) => {
  const inadmissibility_records = (formData.inadmissibility_records || []).map(
    (record) => ({
      condition: record.condition || "",
      condition_name: record.condition || "",
      date: record.date || "",
      doctor_first_name: record.doctor_first_name || "",
      doctor_middle_name: record.doctor_middle_name || "",
      doctor_last_name: record.doctor_last_name || "",
      procedure: record.procedure || "",
      procedure_name: record.name || "",
    }),
  );

  return {
    inadmissibility_records,
  };
};

/**
 * Transform Health data
 */
export const transformHealthData = (formData) => {
  // Helper function to convert "yes"/"no" to "Yes"/"No"
  const capitalizeYesNo = (value) => {
    if (value === "yes") return "Yes";
    if (value === "no") return "No";
    return "No"; // default
  };

  return {
    health_records: {
      std_employee: capitalizeYesNo(formData.hasSTD),
      std_employee_details:
        formData.hasSTD === "yes" ? formData.stdDetails || "" : "",
      std_dependents: capitalizeYesNo(formData.hasStdDependent),
      std_dependents_details:
        formData.hasStdDependent === "yes"
          ? formData.stdDependentDetails || ""
          : "",
      tb_employee: capitalizeYesNo(formData.hasTb),
      tb_employee_details:
        formData.hasTb === "yes" ? formData.tbDetails || "" : "",
      tb_dependents: capitalizeYesNo(formData.hasTbDependent),
      tb_dependents_details:
        formData.hasTbDependent === "yes"
          ? formData.tbDependentDetails || ""
          : "",
      health_insurance_employee: capitalizeYesNo(formData.hasInsurance),
      health_insurance_employee_details:
        formData.hasInsurance === "yes" ? formData.insuranceDetails || "" : "",
      health_insurance_dependents: capitalizeYesNo(
        formData.hasInsuranceDependent,
      ),
      health_insurance_dependents_details:
        formData.hasInsuranceDependent === "yes"
          ? formData.insuranceDependentDetails || ""
          : "",
    },
  };
};
