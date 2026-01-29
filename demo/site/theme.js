export const cssText = `
.ace-tron .ace_gutter {
  background: hsl(var(--mono), var(--layer-bg));
  color: hsl(var(--mono), 85%);
}

.ace-tron .ace_print-margin {
  width: 1px;
  background: #555651
}

.ace-tron {
  background-color: hsl(var(--mono), var(--layer-surface));
  color: hsl(var(--mono), var(--layer-text));
}

.ace-tron .ace_cursor {
  color: #F8F8F0
}

.ace-tron .ace_marker-layer .ace_selection {
  background: #49483E
}

.ace-tron.ace_multiselect .ace_selection.ace_start {
  box-shadow: 0 0 3px 0px #272822;
}

.ace-tron .ace_marker-layer .ace_step {
  background: rgb(102, 82, 0)
}

.ace-tron .ace_marker-layer .ace_bracket {
  margin: -1px 0 0 -1px;
  border: 1px solid #49483E
}

.ace-tron .ace_marker-layer .ace_active-line {
  background: #202020
}

.ace-tron .ace_gutter-active-line {
  background-color: #272727
}

.ace-tron .ace_marker-layer .ace_selected-word {
  border: 1px solid #49483E
}

.ace-tron .ace_invisible {
  color: #52524d
}

.ace-tron .ace_entity.ace_name.ace_tag,
.ace-tron .ace_keyword,
.ace-tron .ace_meta.ace_tag,
.ace-tron .ace_storage {
  color: hsl(var(--error), var(--layer-element));
}

.ace-tron .ace_punctuation,
.ace-tron .ace_punctuation.ace_tag {
  color: #fff
}

.ace-tron .ace_constant.ace_character,
.ace-tron .ace_constant.ace_language,
.ace-tron .ace_constant.ace_numeric,
.ace-tron .ace_constant.ace_other {
  color: hsl(var(--info), var(--layer-element));
}

.ace-tron .ace_invalid {
  color: #F8F8F0;
  background-color: #F92672
}

.ace-tron .ace_invalid.ace_deprecated {
  color: #F8F8F0;
  background-color: #AE81FF
}

.ace-tron .ace_support.ace_constant,
.ace-tron .ace_support.ace_function {
  color: hsl(var(--primary), var(--layer-element));
}

.ace-tron .ace_fold {
  background-color: #A6E22E;
  border-color: #F8F8F2
}

.ace-tron .ace_storage.ace_type,
.ace-tron .ace_support.ace_class,
.ace-tron .ace_support.ace_type {
  font-style: italic;
  color: hsl(var(--primary), var(--layer-element));
}

.ace-tron .ace_entity.ace_name.ace_function,
.ace-tron .ace_entity.ace_other,
.ace-tron .ace_entity.ace_other.ace_attribute-name,
.ace-tron .ace_variable {
  color: hsl(var(--success), var(--layer-element));
}

.ace-tron .ace_variable.ace_parameter {
  font-style: italic;
  color: #FD971F
}

.ace-tron .ace_string {
  color: hsl(var(--warning), var(--layer-element));
}

.ace-tron .ace_comment {
  color: #75715E
}

.ace-tron .ace_indent-guide {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQImWPQ0FD0ZXBzd/wPAAjVAoxeSgNeAAAAAElFTkSuQmCC) right repeat-y
}

.ace-tron .ace_indent-guide-active {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAEklEQVQIW2PQ1dX9zzBz5sz/ABCcBFFentLlAAAAAElFTkSuQmCC) right repeat-y;
}
`
