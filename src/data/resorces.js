// Course catalog, keyed by department id.

export const courses = {
  "geology-mining": [
    { code: "GEY211", title: "Mineralogy" },
    { code: "GEY221", title: "Structural Geology" },
    { code: "GEY231", title: "Sedimentology" },
  ],
};

export function getCourse(departmentId, code) {
  return courses[departmentId]?.find((c) => c.code === code) ?? null;
}

export function getCoursesForDepartment(departmentId) {
  return courses[departmentId] ?? [];
}