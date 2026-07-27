import { useRef } from "react";
import { location } from "@ray-js/ray";

function useQuery<T extends Record<string, any> = Record<string, string>>(): T {
  const query = useRef(location.query).current as T;

  return query;
}

export default useQuery;
