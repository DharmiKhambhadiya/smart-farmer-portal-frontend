import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getCrop } from "../compopnents/services/API/cropapi";
import { Cropcard } from "../compopnents/cropcard";

export const Singlecrop = () => {
  const { id } = useParams();

  const {
    data: crop,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["singlecrop", id],
    queryFn: () => getCrop(id),
  });

  if (isLoading) return <div>Loading crop...</div>;
  if (isError) return <div>Error loading crop.</div>;

  return <Cropcard key={crop._id} crop={crop} />;
};
