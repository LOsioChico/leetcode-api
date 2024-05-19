import Helper from "../utils/helper";
import {
  SubmissionStatus,
  SubmissionConstructor,
  Uris,
} from "../utils/interfaces";

class Submission {
  static uris: Uris;
  static setUris(uris: Uris): void {
    Submission.uris = uris;
  }

  public id: number;
  public title: string;
  public titleSlug: string;
  public status: SubmissionStatus;
  public statusDisplay: string;
  public lang: string;
  public langName: string;
  public runtime: number;
  public timestamp: number;
  public url: string;
  public isPending: boolean;
  public memory: number;
  public hasNotes: boolean;
  public notes: string;
  public flagType: string;
  public topicTags: Array<string>;
  public code?: string;

  constructor({
    id,
    title,
    titleSlug,
    status,
    statusDisplay,
    lang,
    langName,
    runtime,
    timestamp,
    url,
    isPending,
    memory,
    hasNotes,
    notes,
    flagType,
    topicTags,
  }: SubmissionConstructor) {
    this.id = id;
    this.title = title;
    this.titleSlug = titleSlug;
    this.status = status;
    this.statusDisplay = statusDisplay;
    this.lang = lang;
    this.langName = langName;
    this.runtime = runtime;
    this.timestamp = timestamp;
    this.url = url;
    this.isPending = isPending;
    this.memory = memory;
    this.hasNotes = hasNotes;
    this.notes = notes;
    this.flagType = flagType;
    this.topicTags = topicTags;
  }

  setId(id: number): void {
    this.id = id;
  }

  async detail(): Promise<Submission> {
    const response = await Helper.GraphQLRequest({
      query: `
              query submissionDetails($submissionId: Int!) {
                submissionDetails(submissionId: $submissionId) {
                  runtime
                  runtimeDisplay
                  runtimePercentile
                  runtimeDistribution
                  memory
                  memoryDisplay
                  memoryPercentile
                  memoryDistribution
                  code
                  timestamp
                  statusCode
                  user {
                    username
                    profile {
                      realName
                      userAvatar
                    }
                  }
                  lang {
                    name
                    verboseName
                  }
                  question {
                    title
                    questionId
                    titleSlug
                    hasFrontendPreview
                  }
                  notes
                  flagType
                  topicTags {
                    tagId
                    slug
                    name
                  }
                  runtimeError
                  compileError
                  lastTestcase
                  codeOutput
                  expectedOutput
                  totalCorrect
                  totalTestcases
                  fullCodeOutput
                  testDescriptions
                  testBodies
                  testInfo
                  stdOutput
                }
              }
      `,
      variables: {
        submissionId: this.id,
      },
    });
    const submission = response.submissionDetails;

    this.title = submission.question.title;
    this.titleSlug = submission.question.titleSlug;
    this.lang = submission.lang.name;
    this.langName = submission.lang.verboseName;
    this.memory = submission.memory;
    this.runtime = submission.runtime;
    this.status = Helper.submissionStatusMap(submission.statusCode);
    this.statusDisplay = submission.runtimeDisplay;
    this.code = submission.code;
    this.timestamp = submission.timestamp;
    this.hasNotes = submission.hasNotes;
    this.notes = submission.notes;
    this.flagType = submission.flagType;
    this.topicTags = submission.topicTags.map((t: { name: string }) => t.name);

    return this;
  }
}

export default Submission;
