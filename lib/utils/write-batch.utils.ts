export const getWriteBatchMetadataKey = (
  className: string,
  functionName: string,
) => {
  return `nestjs_firestore_${className}#${functionName}_writebatch`;
};
