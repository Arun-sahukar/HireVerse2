import supabaseClient, { supabase } from "@/utils/supabase";

export async function getJobs(token, { location, company_id, searchQuery, recruiter_id } = {}) {
  // const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, company:companies(name, logo_url), saved: saved_jobs(id)");

  if (location) query = query.eq("location", location);
  if (company_id) query = query.eq("company_id", company_id);
  if (searchQuery) query = query.ilike("title", `%${searchQuery}%`);
  if (recruiter_id) query = query.eq("recruiter_id", recruiter_id);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

export async function getSingleJob(token, { job_id }) {
  // const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .select(
      "*, company:companies(name, logo_url), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

export async function addNewJob(token, jobData) {
  // const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error("Supabase Error Creating Job:", error);
    throw new Error(error.message || "Error Creating Job");
  }

  return data;
}

export async function getSavedJobs(token) {
  // const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job:jobs(*, company:companies(name, logo_url))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

export async function updateHiringStatus(token, { job_id }, is_open) {
  // const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ is_open })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Job:", error);
    return null;
  }

  return data;
}

export async function saveJob(token, { alreadySaved }, saveFileData) {
  // const supabase = await supabaseClient(token);

  if (alreadySaved) {
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveFileData.job_id)
      .eq("user_id", saveFileData.user_id)
      .select();

    if (deleteError) {
      console.error("Error deleting Saved Job:", deleteError);
      return null;
    }

    return data;
  } else {
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveFileData])
      .select();

    if (insertError) {
      console.error("Error inserting Saved Job:", insertError);
      return null;
    }

    return data;
  }
}

export async function deleteJob(token, { job_id }) {
  // const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Deleting Job:", error);
    return null;
  }

  return data;
}
