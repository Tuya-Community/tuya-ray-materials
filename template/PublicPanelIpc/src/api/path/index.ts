import { getMovePathList, getMovePointDetails } from '@ray-js/ray';
import { Path, Point } from '@/entities/path/interface';

type GetPathListParams = {
  devId: string;
};
type GetPathListResult = {
  devId: string;
  pathList: Path[];
};
export function getPathList(params: GetPathListParams): Promise<GetPathListResult> {
  return getMovePathList(params);
}

type GetPointDetailsParams = {
  devId: string;
  mpId: number;
};
type GetPointDetailsResult = Point;
export function getPointDetails(params: GetPointDetailsParams): Promise<GetPointDetailsResult> {
  return getMovePointDetails(params);
}
