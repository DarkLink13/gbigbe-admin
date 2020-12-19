import { email, max, numeric, required } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("required", {
  ...required,
  message: "El campo {_field_} es obligatorio"
});

extend("numeric", {
  ...numeric
});

extend("max", {
  ...max
});

extend("min_unit", {
  // @ts-ignore
  validate: (value, { other }) => value >= other,
  message: `El campo {_field_} debe ser mayor que el valor unitario`,
  params: [{ name: "other", isTarget: true }]
});

extend("email", {
  ...email,
  message: "El campo {_field_} debe ser un correo electrónico válido"
});

extend("password", {
  // @ts-ignore
  validate: (value, { other }) => value === other,
  message: "Las contraseñas no coinciden.",
  params: [{ name: "other", isTarget: true }]
});
