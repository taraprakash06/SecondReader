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
  const hasMargins = feedback.comments.length > 0;

  return (
    <div className="space-y-6">
      {marginAnnotationText.trim() ? (
        <div>
          <h3 className="text-base font-semibold text-zinc-900 sm:text-sm">
            {hasMargins ? "Margin notes" : "Draft"}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 sm:text-xs sm:leading-normal">
            {hasMargins
              ? `Inline comments from ${readerName} on the excerpt they annotated.`
              : "Your shared text. The reader left overall feedback below."}
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

      <div className="space-y-4 border-t border-zinc-200 pt-6 text-base leading-relaxed text-zinc-700 sm:text-sm">
        <div>
          <p className="font-medium text-zinc-900">Strengths</p>
          <p className="mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{feedback.strengths || "—"}</p>
        </div>
        <div>
          <p className="font-medium text-zinc-900">Areas for improvement</p>
          <p className="mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{feedback.improvements || "—"}</p>
        </div>
        <div>
          <p className="font-medium text-zinc-900">Key takeaways</p>
          <p className="mt-2 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{feedback.keyTakeaways || "—"}</p>
        </div>
      </div>
    </div>
  );
}
