export const FUNCTIONS_EXAMPLE = `Work with [From.GetAdjective] Allies`;
export const COLOURING_EXAMPLE = `This is my text, §Bthis text is blue§!, and §Rthis text is red§!`;
export const TEXT_ICONS_EXAMPLE = `Unlocks £decision_icon_small decisions`;
export const VARIABLES_EXAMPLE = `$OWNER|UH$ has $CURRENT|H0$/$TOTAL|H0$ points until being able to become $NEXTLEVEL|H$`;

export const HTML_EXAMPLE = {
  [FUNCTIONS_EXAMPLE]:
    'Work with <span translate="no" data-namespace="From.GetAdjective" /> Allies',
  [COLOURING_EXAMPLE]:
    'This is my text, <font translate="no" color="blue" data-color="B">this text is blue</font>, and <font translate="no" color="red" data-color="R">this text is red</font>',
  [TEXT_ICONS_EXAMPLE]:
    'Unlocks <img translate="no" data-name="decision_icon_small" alt="GFX_DECISION_ICON_SMALL" /> decisions',
  [VARIABLES_EXAMPLE]:
    '<span translate="no" data-variable="OWNER|UH" /> has <span translate="no" data-variable="CURRENT|H0" />/<span translate="no" data-variable="TOTAL|H0" /> points until being able to become <span translate="no" data-variable="NEXTLEVEL|H" />',
};
