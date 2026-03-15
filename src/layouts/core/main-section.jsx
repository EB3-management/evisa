import { mergeClasses } from "minimal-shared/utils";

import { styled } from "@mui/material/styles";

import { layoutClasses } from "../core/classes";
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

export function MainSection({ children, className, sx, ...other }) {
  return (
    <MainRoot
      className={mergeClasses([layoutClasses.main, className])}
      sx={sx}
      {...other}
    >
      {children}
    </MainRoot>
  );
}

MainSection.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

// ----------------------------------------------------------------------

// const MainRoot = styled("main")({
//   display: "flex",
//   flex: "1 1 auto",
//   flexDirection: "column",
//   backgroundColor: theme.p
// });

const MainRoot = styled("main")(({ theme }) => ({
  display: "flex",
  flex: "1 1 auto",
  flexDirection: "column",
  backgroundColor: theme.palette.grey[200],
}));
