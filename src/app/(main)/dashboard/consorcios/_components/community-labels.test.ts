import { relationshipLabel, unitStatusLabel, unitTypeLabel } from "./community-labels";
import assert from "node:assert/strict";
import { test } from "node:test";

test("usa la etiqueta definida para valores conocidos", () => {
  assert.equal(unitStatusLabel("ocupado"), "Ocupada");
  assert.equal(unitTypeLabel("departamento"), "Departamento");
  assert.equal(relationshipLabel("propietario"), "Propietario");
});

test("un valor sin etiqueta se muestra con mayúscula inicial", () => {
  assert.equal(unitStatusLabel("en_obra"), "En obra");
  assert.equal(unitTypeLabel("cochera"), "Cochera");
});

test("sin valor no muestra nada", () => {
  assert.equal(relationshipLabel(null), null);
  assert.equal(unitStatusLabel(""), null);
});
