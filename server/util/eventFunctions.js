function sanitizeParticipantData(data) {
    let sanitizedData
    let teamMembersArray = []
    teamMembersArray.push({
        name: data.name,
        universityId: data.universityId,
        tshirtSize: data.tshirtSize,
        email: data.email,
        phnNum: data.phnNum,
        batch: data.batch,
        department: data.department
    })
    delete data.name
    delete data.universityId
    delete data.tshirtSize
    delete data.email
    delete data.phnNum
    delete data.batch
    delete data.department
    for (i = 1; i <data.teamSize; i++) {
        teamMembersArray.push(data[`member${i}`])
        delete data[`member${i}`]
    }
    sanitizedData = { ...data, teamMembers: teamMembersArray }
    return sanitizedData
}

module.exports = { sanitizeParticipantData }