"use server";
import getApiUrl from "@/lib/envGetters/getApiUrl";
import getToken from "@/lib/api/getToken";

export async function predictCustom(data: any): Promise<any> {
  const res = await fetch(getApiUrl() + "/potusai/custom/prediction", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      authorization: await getToken(),
    },
  });
  const json = await res.json();
  if (json.status !== 200) {
    throw new Error(json.error?.error ?? "Unknown error");
  }
  return json;
}
