import { paths } from "src/routes/paths";

import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

export const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} />
);

// export const formatNavData = (item) => ({
//   title: item.menu_name,
//   path: item.route,
//   icon: icon(item.icon),
//   children: item.children.length
//     ? [...item.children]
//         .sort((a, b) => a.position - b.position)
//         .map(formatNavData)
//     : null,
//   isactive: item.is_active,
// });

// export const formatNavData = (item) => {
//   if (!item.is_active) return null; // Skip inactive items

//   const children = (item.children || [])
//     .filter((child) => child.is_active) // Only active children
//     .sort((a, b) => a.position - b.position)
//     .map(formatNavData)
//     .filter(Boolean); // Remove nulls from the map

//   return {
//     title: item.menu_name,
//     path: item.route,
//     icon: icon(item.icon),
//     children: children.length ? children : null,
//     isactive: item.is_active,
//   };
// };

const ICONS = {
  job: icon("ic-job"),
  file: icon("ic-file"),
  dashboard: icon("ic-dashboard-view"),
  contract: icon("ic-invoice"),
  payment: icon("ic-banking"),
  visa: icon("ic-tour"),
  faqs: icon("ic-chat"),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    items: [
      { title: "Dashboard", path: paths.dashboard.root, icon: ICONS.dashboard },
      {
        title: "Jobs",
        path: paths.dashboard.vacancy.root,
        icon: ICONS.job,
      },

      {
        title: "Documents",
        path: paths.dashboard.documents.root,
        icon: ICONS.file,
      },

      {
        title: "Contract",
        path: paths.dashboard.contract.root,
        icon: ICONS.contract,
      },
      {
        title: "Payment History",
        path: paths.dashboard.payment.root,
        icon: ICONS.payment,
      },

      {
        title: "Visa Status",
        path: paths.dashboard.visaStatus.root,
        icon: ICONS.visa,
      },
      {
        title: "Faqs",
        path: paths.dashboard.faqs.root,
        icon: ICONS.faqs,
      },
    ],
  },
];
