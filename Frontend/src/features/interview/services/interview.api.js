import { api } from "../../../lib/api"

export async function generateReport({ jobDescription, selfDescription, resumeFile }) {
    try {
        const formData = new FormData()
        formData.append("jobDescription", jobDescription)
        if (selfDescription) {
            formData.append("selfDescription", selfDescription)
        }
        if (resumeFile) {
            formData.append("resume", resumeFile)
        }

        const response = await api.post("/interview", formData)
        return response.data
    } catch (err) {
        console.error("Error in generateReport api call:", err)
        throw err
    }
}

export async function getReports() {
    try {
        const response = await api.get("/interview")
        return response.data
    } catch (err) {
        console.error("Error in getReports api call:", err)
        throw err
    }
}

export async function getReportById(id) {
    try {
        const response = await api.get(`/interview/${id}`)
        return response.data
    } catch (err) {
        console.error(`Error in getReportById api call for ID ${id}:`, err)
        throw err
    }
}
