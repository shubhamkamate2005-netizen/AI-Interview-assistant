import { useState, useEffect } from "react";
import * as interviewApi from "../services/interview.api";

export const useInterview = () => {
    const [loading, setLoading] = useState(false);
    const [reportsLoading, setReportsLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [reports, setReports] = useState([]);

    const fetchReports = async () => {
        setReportsLoading(true);
        try {
            const data = await interviewApi.getReports();
            setReports(data.reports || []);
        } catch (err) {
            console.error("Failed to fetch reports:", err);
        } finally {
            setReportsLoading(false);
        }
    };

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setGenerating(true);
        try {
            const data = await interviewApi.generateReport({ jobDescription, selfDescription, resumeFile });
            setReports(current => [data.interviewReport, ...current]);
            return data.interviewReport;
        } catch (err) {
            console.error("Failed to generate report:", err);
            throw err;
        } finally {
            setGenerating(false);
        }
    };

    const getReportById = async (id) => {
        setLoading(true);
        try {
            const data = await interviewApi.getReportById(id);
            return data.report;
        } catch (err) {
            console.error("Failed to fetch report:", err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;
        interviewApi.getReports()
            .then(data => {
                if (active) setReports(data.reports || []);
            })
            .catch(err => console.error("Failed to fetch reports:", err))
            .finally(() => {
                if (active) setReportsLoading(false);
            });
        return () => {
            active = false;
        };
    }, []);

    return {
        loading,
        reportsLoading,
        generating,
        reports,
        generateReport,
        getReportById,
        refetchReports: fetchReports
    };
};
