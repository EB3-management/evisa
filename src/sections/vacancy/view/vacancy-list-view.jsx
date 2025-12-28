import { useState } from "react";
import { useGetVacancy, useGetCountryVisa } from "src/api/vacancy";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { VacancyList } from "src/sections/app/view/vacancy-list";

export function VacancyListView() {
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedVisaCategory, setSelectedVisaCategory] = useState("all");

  const { vacancy, vacancyLoading } = useGetVacancy(selectedCountry, selectedVisaCategory);
  const { visaCountry, visaCountryLoading } = useGetCountryVisa();
  return (
    <DashboardContent>
      <CustomBreadcrumbs
        links={[
          { name: "Dashboard", href: paths.dashboard.root },
          {
            name: "Vacancy",
            href: paths.dashboard.vacancy.root,
          },
          { name: "List" },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <VacancyList 
        vacancyList={vacancy} 
        countryList={visaCountry}
        selectedCountry={selectedCountry}
        selectedVisaCategory={selectedVisaCategory}
        onCountryChange={setSelectedCountry}
        onVisaCategoryChange={setSelectedVisaCategory}
      />
    </DashboardContent>
  );
}
