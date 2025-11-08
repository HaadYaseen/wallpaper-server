
export function getOperationName(query: string | undefined): string | null {
  if (!query) {
    return null;
  }
  const operationNameMatch = query.match(
    /(?:query|mutation|subscription)\s+(\w+)/
  );

  if (operationNameMatch && operationNameMatch[1]) {
    return operationNameMatch[1];
  }

  const fieldMatch = query.match(/\{\s*(\w+)/);
  if (fieldMatch && fieldMatch[1]) {
    return fieldMatch[1];
  }

  return null;
}

