import { GraphQLClient } from "graphql-request";
import Config from "../lib/config";
import Leetcode from "../lib/leetcode";
import Problem from "../lib/problem";
import Submission from "../lib/submission";
import {
  Credit,
  EndPoint,
  GraphQLRequestOptions,
  HttpRequestOptions,
  ProblemDifficulty,
  ProblemStatus,
  SubmissionStatus,
  Uris,
} from "./interfaces";

class Helper {
  static credit: Credit;
  static uris: Uris;

  static setCredit(credit: Credit): void {
    Helper.credit = credit;
  }

  static setUris(uris: Uris): void {
    Helper.uris = uris;
  }

  static parseCookie(cookies: Array<string>, key: string): string {
    if (!cookies) {
      return "";
    }
    for (let ix = 0; ix !== cookies.length; ++ix) {
      const result = cookies[ix].match(new RegExp(`${key}=(.+?);`));
      if (result) {
        return result[1] || "";
      }
    }
    return "";
  }

  static levelToName(level: number): string {
    switch (level) {
      case 1:
        return "Easy";
      case 2:
        return "Medium";
      case 3:
        return "Hard";
      default:
        return "";
    }
  }

  static statusMap(status: string | null): ProblemStatus {
    switch (status) {
      case "ac":
        return ProblemStatus["Accept"];
      case "notac":
        return ProblemStatus["Not Accept"];
      case null:
        return ProblemStatus["Not Start"];
      default:
        return ProblemStatus["Not Start"];
    }
  }

  static difficultyMap(difficulty: number): ProblemDifficulty {
    switch (difficulty) {
      case 1:
        return ProblemDifficulty.Easy;
      case 2:
        return ProblemDifficulty.Medium;
      case 3:
        return ProblemDifficulty.Hard;
      default:
        return ProblemDifficulty.Easy;
    }
  }

  static submissionStatusMap(submission: string): SubmissionStatus {
    switch (submission) {
      case "Accepted":
        return SubmissionStatus["Accepted"];
      case "Compile Error":
        return SubmissionStatus["Compile Error"];
      case "Time Limit Exceeded":
        return SubmissionStatus["Time Limit Exceeded"];
      case "Memory Limit Exceeded":
        return SubmissionStatus["Memory Limit Exceeded"];
      case "Output Limit Exceeded":
        return SubmissionStatus["Output Limit Exceeded"];
      case "Runtime Error":
        return SubmissionStatus["Runtime Error"];
      case "Internal Error":
        return SubmissionStatus["Internal Error"];
      case "Timeout":
        return SubmissionStatus["Timeout"];
      case "Wrong Answer":
        return SubmissionStatus["Wrong Answer"];

      case "10":
        return SubmissionStatus["Accepted"];
      case "11":
        return SubmissionStatus["Wrong Answer"];
      case "12":
        return SubmissionStatus["Memory Limit Exceeded"];
      case "13":
        return SubmissionStatus["Output Limit Exceeded"];
      case "14":
        return SubmissionStatus["Time Limit Exceeded"];
      case "15":
        return SubmissionStatus["Runtime Error"];
      case "16":
        return SubmissionStatus["Internal Error"];
      case "20":
        return SubmissionStatus["Compile Error"];
      case "30":
        return SubmissionStatus["Timeout"];
      // TODO : find out what this numbers mean
      // 21 => UE
      default:
        return SubmissionStatus["Wrong Answer"];
    }
  }

  static async HttpRequest(options: HttpRequestOptions): Promise<Response> {
    return await fetch(options.url, {
      method: options.method || "GET",
      headers: {
        Cookie: Helper.credit
          ? `LEETCODE_SESSION=${Helper.credit.session}; csrftoken=${Helper.credit.csrfToken};`
          : "",
        "X-CSRFToken": Helper.credit ? Helper.credit.csrfToken : "",
        "X-Requested-With": "XMLHttpRequest",
        Referer: options.referer || Helper.uris.base,
        "upgrade-insecure-requests": "1",
      },
      body: JSON.stringify(options.body) || null,
    });
  }

  static async GraphQLRequest(options: GraphQLRequestOptions): Promise<any> {
    const client = new GraphQLClient(Helper.uris.graphql, {
      headers: {
        Origin: options.origin || Helper.uris.base,
        Referer: options.referer || Helper.uris.base,
        Cookie: `LEETCODE_SESSION=${Helper.credit.session};csrftoken=${Helper.credit.csrfToken};`,
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": Helper.credit.csrfToken,
      },
    });
    return await client.request(options.query, options.variables || {});
  }

  static switchEndPoint(endPoint: EndPoint): void {
    if (endPoint === EndPoint.US) {
      const uris: Uris = Config.uri.us;
      Helper.setUris(uris);
      Leetcode.setUris(uris);
      Problem.setUris(uris);
      Submission.setUris(uris);
    } else if (endPoint === EndPoint.CN) {
      const uris: Uris = Config.uri.cn;
      Helper.setUris(uris);
      Leetcode.setUris(uris);
      Problem.setUris(uris);
      Submission.setUris(uris);
    }
  }
}

export default Helper;
