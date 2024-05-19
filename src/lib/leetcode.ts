import Helper from "../utils/helper";
import { Credit, EndPoint, Uris } from "../utils/interfaces";
import Problem from "./problem";

class Leetcode {
  session?: string;
  csrfToken: string;

  static uris: Uris;
  static setUris(uris: Uris): void {
    Leetcode.uris = uris;
  }

  constructor(session: string, csrfToken: string, endpoint?: EndPoint) {
    this.session = session;
    this.csrfToken = csrfToken;
    this.configure(endpoint);
  }

  configure(endpoint?: EndPoint): void {
    Helper.setCredit({
      session: this.session,
      csrfToken: this.csrfToken,
    });

    Helper.switchEndPoint(endpoint || EndPoint.US);
  }

  get credit(): Credit {
    return {
      session: this.session,
      csrfToken: this.csrfToken,
    };
  }

  async getProfile(): Promise<any> {
    // ? TODO : fetch more user profile.
    const response: any = await Helper.GraphQLRequest({
      query: `
            {
                userStatus {
                    username
                }
            }
            `,
    });
    return response.userStatus;
  }

  async getAllProblems(): Promise<Array<Problem>> {
    const response = await Helper.HttpRequest({
      url: Leetcode.uris.problemsAll,
    }).then((r) => r.json());
    const problems: Array<Problem> = response.stat_status_pairs.map(
      (p: any) => {
        return new Problem(
          p.stat.question__title_slug,
          p.stat.question_id,
          p.stat.question__title,
          Helper.difficultyMap(p.difficulty.level),
          p.is_favor,
          p.paid_only,
          undefined,
          undefined,
          Helper.statusMap(p.status),
          undefined,
          p.stat.total_acs,
          p.stat.total_submitted,
          undefined,
          undefined,
          undefined,
        );
      },
    );
    return problems;
  }

  async getProblemsByTag(tag: string): Promise<Array<Problem>> {
    const response = await Helper.GraphQLRequest({
      query: `
                query getTopicTag($slug: String!) {
                    topicTag(slug: $slug) {
                        questions {
                            status
                            questionId
                            title
                            titleSlug
                            stats
                            difficulty
                            isPaidOnly
                            topicTags {
                                slug
                            }
                        }
                    }
                }
            `,
      variables: {
        slug: tag,
      },
    });
    const problems: Array<Problem> = response.topicTag.questions.map(
      (p: any) => {
        const stat: any = JSON.parse(p.stats);
        return new Problem(
          p.titleSlug,
          p.questionId,
          p.title,
          stat.title,
          undefined,
          p.isPaidOnly,
          undefined,
          undefined,
          Helper.statusMap(p.status),
          p.topicTags.map((t: any) => t.slug),
          stat.totalAcceptedRaw,
          stat.totalSubmissionRaw,
          undefined,
          undefined,
          undefined,
        );
      },
    );
    return problems;
  }
}

export default Leetcode;
