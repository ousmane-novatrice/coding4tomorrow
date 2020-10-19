export interface IOperationResult {
  n?: number;
  ok?: number;
}

export interface IDeleteResult extends IOperationResult {
  deletedCount?: number;
}

export interface IUpdateResult extends IOperationResult {
  nModified?: number;
}
