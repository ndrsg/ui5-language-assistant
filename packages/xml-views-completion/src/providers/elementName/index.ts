import { aggregationSuggestions } from "./aggregation";
import { defaultAggregationSuggestions } from "./defaultAggregation";
import { nestedClassSuggestions } from "./nested-class";
import { ElementNameCompletion } from "@xml-tools/content-assist";
import { XMLViewCompletion } from "../../../api";
import { UI5SemanticModel } from "@vscode-ui5/semantic-model";

export const elementNameProviders: ElementNameCompletion<
  XMLViewCompletion,
  UI5SemanticModel
>[] = [
  aggregationSuggestions,
  defaultAggregationSuggestions,
  nestedClassSuggestions
];