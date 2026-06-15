/* ============================================================
   data/index.js — composes the single DEMO object (PRD §8, §11)
   The store and every component import DEMO from here.
   ============================================================ */
import { ARTICLE, SEGMENTS, TERMS, OFFERS, FLOWS, CONFIG, TEASERS, MEDIA_TEASERS } from "./data.js";
import { CONV } from "./conversations.js";

export const DEMO = { ARTICLE, SEGMENTS, TERMS, OFFERS, FLOWS, CONFIG, TEASERS, MEDIA_TEASERS, CONV };
