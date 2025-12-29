import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import axiosClient from "../axios";

type ToPost = {
  date: string;
};

const url = "/user/auth/otp-code/";

type GenerateTagihanParams = {
  date: string;
};

type UseMutationOptionsDefault = UseMutationOptions<
  GenerateTagihanSchema,
  Error,
  GenerateTagihanParams,
  unknown
>;

const generateTagihanSchema = z.object({
  message: z.literal("generating"),
});

type GenerateTagihanSchema = z.infer<typeof generateTagihanSchema>;

const useGenerateTagihan = (options?: UseMutationOptionsDefault) => {
  const generateTagihan = async (
    params: GenerateTagihanParams
  ): Promise<GenerateTagihanSchema> => {
    const { date } = params;
    const toPost = {
      date: date,
    } satisfies ToPost;
    const result = await axiosClient.post(url, toPost);
    const parsedResult = generateTagihanSchema.parse(result.data);
    return parsedResult;
  };
  const mutation = useMutation({
    mutationFn: generateTagihan,
    ...options,
  });
  return mutation;
};

export default useGenerateTagihan;
