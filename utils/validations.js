export default function validate(
  name,
  value,
  errors = { name: "", email: "", password: "" }
) {
  switch (name) {
    case "email":
      if (!value) {
        errors.email = "Email address is required.";
        delete errors.customer_email;
      } else if (
        !new RegExp(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ).test(value)
      ) {
        errors.email = "Enter a valid email address.";
        errors.customer_email = "Enter a valid email address.";
      } else {
        delete errors.email;
        delete errors.customer_email;
      }
      break;

    case "password":
      if (!value) {
        errors.password = "Password is required.";
      } else if (value.length < 6) {
        errors.password = "Password should have at least 6 characters.";
      } else {
        delete errors.password;
      }
      break;
    case "name":
      if (!value) {
        errors.name = "Name is required.";
      } else {
        delete errors.name;
      }
      break;
  }
  return errors;
}
