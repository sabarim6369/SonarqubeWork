const axios = require("axios");

async function checkCompletionStatus(task, student) {
    if (student.platforms[task.platform] === "not-assigned") {
        return { message: "You are not assigned to this platform", status: "notAssigned", code: 403 };
    }
    
    if (task.platform === "leetcode") {
        const leetcodeUsername = student.platforms.leetcode;
        if (!leetcodeUsername) {
            return { message: "LeetCode username not set", status: "missingUsername", code: 400 };
        }

        try {
            const isSolved = await leetcodeProblemStatus(leetcodeUsername, task.link);
            if (isSolved) {
                return { message: "Problem solved", status: "completed", code: 200 };
            } else {
                return { message: "Problem not solved yet", status: "notCompleted", code: 201 };
            }
        } catch (error) {
            console.error("Error checking LeetCode problem:", error);
            return { message: "Error checking LeetCode problem", status: "error", code: 500 };
        }
    }
}

async function checkCodingStatus(task, student) {
    console.log("inside checkCodingStatus");
    
    if (student.platforms[task.platform] === "not-assigned") {
        console.log("not assigned");
        return { message: "You are not assigned to this platform", status: "notAssigned", code: 403 };
    }
    console.log("assigned to platform", task.platform);
    if (task.platform === "leetcode") {
        const codingUsername = student.platforms.leetcode;
        if (!codingUsername) {
            return { message: "Coding username not set", status: "missingUsername", code: 400 };
        }

        try {
            const isSolved = await leetcodeProblemStatus(codingUsername, task.link);
            console.log("isSolved", isSolved);
            if (isSolved) {
                return { message: "Problem solved", status: "completed", code: 200 };
            } else {
                return { message: "Problem not solved yet", status: "notCompleted", code: 201 };
            }
        } catch (error) {
            console.error("Error checking Coding problem:", error);
            return { message: "Error checking Coding problem", status: "error", code: 500 };
        }
    }
    
    console.log("platform not supported");
    return { message: "Platform not supported", status: "unsupportedPlatform", code: 400 };
}


async function leetcodeProblemStatus(username, problemLink) {
    try {
        console.log("Checking LeetCode problem status for username:", username, "and problem link:", problemLink);
        const urlPattern = /leetcode\.com\/u\/([^/]+)\/?/;
        const match = username.match(urlPattern);
        if (match) {
            username = match[1].trim(); 
        } else {
            throw new Error("Invalid LeetCode profile link format");
        }


        const url = new URL(problemLink);
        const parts = url.pathname.split("/");
        const problemSlug = parts.includes("problems") ? parts[parts.indexOf("problems") + 1] : null;

        if (!problemSlug) {
            throw new Error("Invalid LeetCode problem link");
        }

        const QUERY = `
            query userSubmission($username: String!) {
                recentSubmissionList(username: $username) {
                    titleSlug
                    statusDisplay
                }
            }
        `;

        const response = await axios.post(
            "https://leetcode.com/graphql",
            {
                query: QUERY,
                variables: { username }
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const submissions = response.data?.data?.recentSubmissionList;
        if (!Array.isArray(submissions)) {
            console.error("LeetCode API response does not contain expected data:", response.data);
            return false;
        }

        return submissions.some(sub => sub.titleSlug === problemSlug && sub.statusDisplay === "Accepted");
    } catch (error) {
        console.error("Error in leetcodeProblemStatus:", error);
        throw error;
    }
}



module.exports = { checkCompletionStatus, checkCodingStatus };
