export const courses = {
  "geology-mining": [
    { code: "GEY202", title: "Crystallography and Systematic Mineralogy", units: 2, examFormat: "theory" },
    { code: "ENT202", title: "Entrepreneurship and Innovation", units: 2, examFormat: "cbt" },
    { code: "GEY210", title: "Introduction to Structural Geology and Map Interpretation", units: 2, examFormat: "null" },
    { code: "IBBUL-GEY214", title: "Optical Mineralogy", units: 2, examFormat: "cbt" },
    { code: "IBBUL-GEY216", title: "Mineral Resources and Environmental Geology", units: 3, examFormat: "theory" },
    { code: "IBBUL-GEY218", title: "Mining Geology and Mineral Processing", units: 3, examFormat: "theory" },
      ],
};

export function getCourse(departmentId, code) {
  return courses[departmentId]?.find((c) => c.code === code) ?? null;
}

export function getCoursesForDepartment(departmentId) {
  return courses[departmentId] ?? [];
}