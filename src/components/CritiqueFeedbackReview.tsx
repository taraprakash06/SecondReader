import { MarginCommentsStatic } from "@/components/MarginCommentsStatic";
import type { MarginCommentsLayoutVariant } from "@/lib/margin-comments-layout";

type FeedbackLike = {
  strengths: string;
  improvements: string;
  keyTakeaways: string;
  comments: Array<{ id: string; quote: string; message: string }>;
};

export function CritiqueFeedbackReview({
  feedback,
  marginAnnotationText,
  readerName,
  layoutVariant = "wide",
}: {
  feedback: FeedbackLike;
  marginAnnotationText: string;
  readerName: string;
  layoutVariant?: MarginCommentsLayoutVariant;
}) {
  return (
    <div className="space-y-6">
      {feedback.comments.length > 0 ? (
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Margin notes</h3>
          <p className="mt-1 text-xs text-zinc-600">
            Inline comments from {readerName} on the excerpt they annotated.
          </p>
          <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200">
            <MarginCommentsStatic
              text={marginAnnotationText}
              layoutVariant={layoutVariant}
              comments={feedback.comments.map((c) => ({
                id: c.id,
                quote: c.quote,
                message: c.message,
              }))}
              readerName={readerName}
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-3 text-sm text-zinc-700">
        <div>
          <p className="font-medium text-zinc-900">Strengths</p>
          <p className="mt-1 whitespace-pre-wrap">{feedback.strengths || "—"}</p>
        </div>
        <div>
          <p className="font-medium text-zinc-900">Areas for improvement</p>
          <p className="mt-1 whitespace-pre-wrap">{feedback.improvements || "—"}</p>
        </div>
        <div>
          <p className="font-medium text-zinc-900">Key takeaways</p>
          <p className="mt-1 whitespace-pre-wrap">{feedback.keyTakeaways || "—"}</p>
        </div>
      </div>
    </div>
  );
}
