// Valida os JSON Schemas com exemplos bons e ruins. Uso: bun add ajv ajv-formats (numa pasta temporária) e: bun tests/validate-schemas.mjs
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import fs from "fs";
const R = new URL("../", import.meta.url).pathname; // raiz do repositório
const ajv = new Ajv2020({allErrors:true, strict:false}); addFormats(ajv);
for (const f of fs.readdirSync(R+"schema")) {
  if (f.endsWith(".json")) {
    ajv.addSchema(JSON.parse(fs.readFileSync(R+"schema/"+f)));
  }
}
const rd = p => JSON.parse(fs.readFileSync(R+p));
function check(id, inst, deve){
  const v = ajv.getSchema(id);
  const ok = v(inst);
  console.log(ok===deve?"OK  ":"ERRO", id, ok?"passou":"falhou", ok?"":ajv.errorsText(v.errors).slice(0,80));
}

const b = {id:"c",title:"T",description:"Curso baseado no livro X de Y.",book:{title:"X",authors:"Y"},modules:["01"]};
check("course.schema.json", {...b,customCallouts:["x-prova"]}, true);
check("course.schema.json", {...b,customCallouts:["prova"]}, false);
check("lesson.schema.json", rd("examples/lesson.exemplo.json"), true);
check("event.schema.json", rd("examples/event.exemplo.json"), true);
check("lab.schema.json", {type:"lab",id:"x",title:"t",source:"custom",mobile:"full"}, false);
check("lab.schema.json", {type:"lab",id:"x",title:"t",source:"catalog"}, false);
check("event.schema.json", {ts:"2026-11-01T14:03:22-03:00",course:"a",type:"lesson_open"}, false);
check("profile.schema.json", {id:"pratico",extends:["padrao"],lesson:["intro","lab","text","summary"]}, true);

// Novos schemas
check("module.schema.json", rd("examples/module.exemplo.json"), true);
check("module.schema.json", { id: "01", title: "Módulo sem aulas" }, false); // lessons obrigatório
check("quiz.schema.json", rd("examples/quiz.exemplo.json"), true);
check("quiz.schema.json", { title: "Quiz sem questões", questions: [] }, false); // minItems: 1
check("exercises.schema.json", rd("examples/exercises.exemplo.json"), true);
check("exercises.schema.json", { title: "Exercício sem lista", exercises: [] }, false); // minItems: 1
