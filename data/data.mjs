import json_spa from "./spa.motog4-3gslow.result.json" assert { type: "json" }
import json_mpa from "./mpa.motog4-3gslow.result.json" assert { type: "json" }
import json_iso from "./iso.motog4-3gslow.result.json" assert { type: "json" }
import json_spa_shell from "./spa-shell.motog4-3gslow.result.json" assert { type: "json" }
import json_mpa_shell from "./mpa-shell.motog4-3gslow.result.json" assert { type: "json" }
import json_iso_shell from "./iso-shell.motog4-3gslow.result.json" assert { type: "json" }

export const spa = json_spa.data
export const mpa = json_mpa.data
export const iso = json_iso.data
export const spa_shell = json_spa_shell.data
export const mpa_shell = json_mpa_shell.data
export const iso_shell = json_iso_shell.data
