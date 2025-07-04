// clues.js
import { Clues_AD } from "./clues_A-D";
import { Clues_EH } from "./clues_E-H";
import { Clues_IO } from "./clues_I-O";
import { Clues_PT } from "./clues_P-T";
import { Clues_UZ } from "./clues_U-Z";

export const Clues = {
  ...Clues_AD,
  ...Clues_EH,
  ...Clues_IO,
  ...Clues_PT,
  ...Clues_UZ
};


export const clueIds = Object.keys(Clues).map(Number);
