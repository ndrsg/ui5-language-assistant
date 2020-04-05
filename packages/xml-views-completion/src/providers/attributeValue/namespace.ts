import { map, find, filter, values } from "lodash";
import { XMLAttribute } from "@xml-tools/ast";
import {
  isElementSubClass,
  ui5NodeToFQN
} from "@ui5-language-assistant/logic-utils";
import { getClassByElement } from "../utils/filter-members";
import { UI5AttributeValueCompletionOptions } from "./index";
import { UI5NamespacesInXMLAttributeValueCompletion } from "../../../api";
import {
  getXMLNamespaceKeyPrefix,
  isXMLNamespaceKey
} from "../utils/xml-ns-key";

/**
 * Suggests namespace value for namespace attribute
 * In case value's prefix ends with dot we'll use the mode of exploration and provide
 * only next level values of namespaces starting with the prefix
 * In other cases we'll provide all values containing the prefix
 **/
export function namespaceValueSuggestions(
  opts: UI5AttributeValueCompletionOptions
): UI5NamespacesInXMLAttributeValueCompletion[] {
  const xmlAttribute = opts.attribute;
  const xmlAttributeName = xmlAttribute.key;

  if (xmlAttributeName === null || !isXMLNamespaceKey(xmlAttributeName)) {
    return [];
  }

  const ui5Model = opts.context;
  const xmlElement = opts.element;

  const ui5Class = getClassByElement(xmlElement, ui5Model);
  if (ui5Class === undefined) {
    return [];
  }

  const attributeValue = xmlAttribute.value ?? "";

  let applicableNamespaces = values(ui5Model.namespaces);

  if (attributeValue !== "") {
    applicableNamespaces = filter(applicableNamespaces, _ =>
      ui5NodeToFQN(_).includes(attributeValue)
    );
  }

  const xmlnsPrefix = getXMLNamespaceKeyPrefix(xmlAttributeName);

  if (attributeValue.endsWith(".")) {
    const applicableNamespacesForExploration = filter(applicableNamespaces, _ =>
      ui5NodeToFQN(_).startsWith(attributeValue)
    );
    if (applicableNamespacesForExploration.length > 0) {
      applicableNamespaces = applicableNamespacesForExploration;
    }
  }

  if (xmlnsPrefix !== "") {
    const applicableNamespacesWithPrefix = filter(
      applicableNamespaces,
      _ => _.name === xmlnsPrefix
    );
    if (applicableNamespacesWithPrefix.length > 0) {
      applicableNamespaces = applicableNamespacesWithPrefix;
    }
  }

  applicableNamespaces = filter(
    applicableNamespaces,
    _ => find(_.classes, isElementSubClass) !== undefined
  );

  return map(applicableNamespaces, _ => ({
    type: "UI5NamespacesInXMLAttributeValue",
    ui5Node: _,
    astNode: opts.attribute as XMLAttribute
  }));
}