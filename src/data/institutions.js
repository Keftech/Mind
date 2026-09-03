// Institution data model. Adding a new university, faculty, or
// department later means adding an entry here — never touching a
// component.

export const institutions = {
  ibbul: {
    id: "ibbul",
    name: "Ibrahim Badamasi Babangida University Lapai",
    shortName: "IBBUL",
    country: "Nigeria",
    faculties: {
      "physical-sciences": {
        id: "physical-sciences",
        name: "Physical Sciences",
        departments: {
          "geology-mining": {
            id: "geology-mining",
            name: "Geology and Mining",
          },
        },
      },
    },
  },
};

export function getDepartment(universityId, facultyId, departmentId) {
  return institutions[universityId]?.faculties[facultyId]?.departments[departmentId] ?? null;
}