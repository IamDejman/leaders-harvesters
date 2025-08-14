import { useMutation } from "@tanstack/react-query";
import supabase from "./supabase";

const table = "conference1"  
const markPresent = async (person) => {
  // const day = getAwakeningDay();
  const isPresentKey = "ispresent";
  const { data: worker } = await supabase
  .from(table)
  .select("*")
    .eq("id", person.id);

  const workerAttendance = worker[0][isPresentKey];

  if (workerAttendance) return worker[0];

  const dateUTC = new Date();
  const dateISO = dateUTC.toISOString();

  const { data, error } = await supabase
    .from(table)
    .update({ [isPresentKey]: true, updatedat: dateISO })
    .eq("id", person.id);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

const manualAttendance = async (person) => {
  const { data, error } = await supabase
    .from(table)
    .insert({ ...person, validate: true })
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
const updateWorker = async (person) => {
  const { id, ...rest} = person
  const { data, error } = await supabase
    .from(table)
    .update({ ...rest, ispresent: true })
    .eq("id", person.id)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const useAttendance = () => {
  return useMutation({
    mutationFn: markPresent,
    cacheTime: 0,
  });
};

export const useManualAttendance = () => {
  return useMutation({
    mutationFn: manualAttendance,
    cacheTime: 0,
  });
};

export const useWorkerUpdate = () => {
  return useMutation({
    mutationFn: updateWorker,
    cacheTime: 0,
  });
};
