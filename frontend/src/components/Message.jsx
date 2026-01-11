import React from "react";
import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  let content = children;

  // 👉 Nếu children là object (error từ backend)
  if (typeof children === "object") {
    content =
      children?.message ||
      children?.error ||
      "Có lỗi xảy ra";
  }

  return <Alert variant={variant}>{content}</Alert>;
};

Message.defaultProps = {
  variant: "info",
};

export default Message;