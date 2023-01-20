export const getTransactionMetadataKey = (
  className: string,
  functionName: string,
) => {
  return `nestjs_firestore_${className}#${functionName}_tx`;
};
