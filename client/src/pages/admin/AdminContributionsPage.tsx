import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  RotateCcw,
  Sparkles,
  Award,
  X
} from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import type { AdminContribution, AdminLanguage } from '../../types';

export const AdminContributionsPage: React.FC = () => {
  const [contributions, setContributions] = useState<AdminContribution[]>([]);
  const [languages, setLanguages] = useState<AdminLanguage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Review modal state
  const [selectedContribution, setSelectedContribution] = useState<AdminContribution | null>(null);
  const [reviewStatusAction, setReviewStatusAction] = useState<string>('approved');
  const [reviewNotes, setReviewNotes] = useState<string>('');
  const [awardBonusXP, setAwardBonusXP] = useState<boolean>(true);
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cData, lData] = await Promise.all([
        adminApi.getContributions(),
        adminApi.getLanguages()
      ]);
      setContributions(cData);
      setLanguages(lData);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load contributions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openReviewModal = (item: AdminContribution, action: string) => {
    setSelectedContribution(item);
    setReviewStatusAction(action);
    setReviewNotes(item.reviewNotes || '');
    setAwardBonusXP(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContribution) return;

    try {
      setSubmittingReview(true);
      await adminApi.reviewContribution(selectedContribution.contributionId, {
        status: reviewStatusAction,
        reviewNotes,
        rejectionReason: reviewStatusAction === 'rejected' ? reviewNotes : undefined,
        awardBonusXP: reviewStatusAction === 'approved' ? awardBonusXP : false
      });
      setSelectedContribution(null);
      await loadData();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredContributions = useMemo(() => {
    return contributions.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        c.content.toLowerCase().includes(q) ||
        c.authorName.toLowerCase().includes(q) ||
        c.tribalText?.toLowerCase().includes(q) ||
        c.translation?.toLowerCase().includes(q);
      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
      const matchesLang = selectedLanguage === 'all' || c.languageId === selectedLanguage;
      const matchesType = selectedType === 'all' || c.contentType === selectedType;
      return matchesSearch && matchesStatus && matchesLang && matchesType;
    });
  }, [contributions, searchQuery, selectedStatus, selectedLanguage, selectedType]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-vanisetu-primary flex items-center gap-2">
            <Users className="w-7 h-7 text-vanisetu-accent" />
            Community Contribution Verification
          </h1>
          <p className="text-sm text-vanisetu-text-muted mt-1">
            Review, verify, diff-compare, and reward crowdsourced tribal linguistic and cultural submissions.
          </p>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Pending Review</p>
          <p className="text-2xl font-bold text-amber-600 mt-0.5">
            {contributions.filter(c => c.status === 'pending_review' || c.status === 'submitted').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Under Review</p>
          <p className="text-2xl font-bold text-blue-600 mt-0.5">
            {contributions.filter(c => c.status === 'under_review').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Approved & Published</p>
          <p className="text-2xl font-bold text-green-700 mt-0.5">
            {contributions.filter(c => c.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Needs Revision</p>
          <p className="text-2xl font-bold text-orange-600 mt-0.5">
            {contributions.filter(c => c.status === 'needs_revision').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-vanisetu-primary/10 shadow-sm">
          <p className="text-xs text-vanisetu-text-muted font-medium">Rejected</p>
          <p className="text-2xl font-bold text-gray-500 mt-0.5">
            {contributions.filter(c => c.status === 'rejected').length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-vanisetu-primary/10 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, author, tribal phrase, or translation..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-vanisetu-text-muted">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending_review">Pending Review</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="needs_revision">Needs Revision</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={selectedLanguage}
              onChange={e => setSelectedLanguage(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Languages</option>
              {languages.map(l => (
                <option key={l.languageId} value={l.languageId}>
                  {l.name}
                </option>
              ))}
            </select>
            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-vanisetu-primary outline-none"
            >
              <option value="all">All Types</option>
              <option value="word">Vocabulary Word</option>
              <option value="story">Folklore & Story</option>
              <option value="song">Tribal Song</option>
              <option value="proverb">Proverb</option>
              <option value="translation">Translation</option>
              <option value="correction">Correction</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contributions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-xl text-center text-sm text-vanisetu-text-muted border border-vanisetu-primary/10">
            Loading contributions queue...
          </div>
        ) : error ? (
          <div className="bg-white p-8 rounded-xl text-center text-red-600 text-sm border border-red-200">
            {error}
          </div>
        ) : filteredContributions.length === 0 ? (
          <div className="bg-white p-12 rounded-xl text-center text-sm text-vanisetu-text-muted border border-vanisetu-primary/10">
            No community contributions found for current filters.
          </div>
        ) : (
          filteredContributions.map(item => {
            const lang = languages.find(l => l.languageId === item.languageId);

            return (
              <div
                key={item.contributionId}
                className="bg-white rounded-xl p-5 border border-vanisetu-primary/10 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase bg-vanisetu-cream text-vanisetu-primary border border-vanisetu-primary/20">
                      {item.contentType}
                    </span>
                    <span className="text-xs text-vanisetu-text-muted font-medium">
                      Language: <strong className="text-vanisetu-primary">{lang?.name || item.languageId}</strong>
                    </span>
                    <span className="text-xs text-gray-400 font-mono">#{item.contributionId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'approved'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : item.status === 'pending_review' || item.status === 'submitted'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : item.status === 'under_review'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : item.status === 'needs_revision'
                          ? 'bg-orange-50 text-orange-700 border border-orange-200'
                          : 'bg-gray-100 text-gray-700 border border-gray-200'
                      }`}
                    >
                      {item.status === 'approved' && <CheckCircle className="w-3.5 h-3.5" />}
                      {(item.status === 'pending_review' || item.status === 'submitted') && <Clock className="w-3.5 h-3.5" />}
                      {item.status === 'under_review' && <Eye className="w-3.5 h-3.5" />}
                      {item.status === 'needs_revision' && <RotateCcw className="w-3.5 h-3.5" />}
                      {item.status === 'rejected' && <XCircle className="w-3.5 h-3.5" />}
                      <span className="capitalize">{item.status.replace('_', ' ')}</span>
                    </span>
                  </div>
                </div>

                {/* Contribution details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-vanisetu-cream/40 p-4 rounded-xl border border-vanisetu-primary/10">
                    <p className="text-xs font-bold uppercase tracking-wider text-vanisetu-primary mb-1">
                      Submitted Tribal Text
                    </p>
                    <p className="text-base font-bold text-vanisetu-primary font-serif">
                      {item.tribalText || item.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">{item.content}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Translation / Meaning
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {item.translation || 'No direct translation provided'}
                    </p>
                    {item.culturalContext && (
                      <p className="text-xs text-vanisetu-text-muted mt-2">
                        <strong>Cultural Context:</strong> {item.culturalContext}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submitter & Review details */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-vanisetu-text-muted pt-2 border-t border-gray-100 gap-2">
                  <div className="flex items-center gap-3">
                    <span>
                      Submitted by: <strong className="text-gray-700">{item.authorName}</strong>
                    </span>
                    <span>•</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.reviewerName && (
                      <>
                        <span>•</span>
                        <span>
                          Reviewed by: <strong className="text-gray-700">{item.reviewerName}</strong>
                        </span>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openReviewModal(item, 'under_review')}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Inspect Diff
                    </button>
                    {item.status !== 'approved' && (
                      <button
                        onClick={() => openReviewModal(item, 'approved')}
                        className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition shadow-sm"
                      >
                        Approve
                      </button>
                    )}
                    {item.status !== 'needs_revision' && (
                      <button
                        onClick={() => openReviewModal(item, 'needs_revision')}
                        className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-800 text-xs font-semibold hover:bg-orange-200 transition"
                      >
                        Request Revision
                      </button>
                    )}
                    {item.status !== 'rejected' && (
                      <button
                        onClick={() => openReviewModal(item, 'rejected')}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Review & Diff Comparison Modal */}
      {selectedContribution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-vanisetu-primary/20 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-vanisetu-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-vanisetu-accent" />
                Review Contribution #{selectedContribution.contributionId}
              </h3>
              <button
                onClick={() => setSelectedContribution(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-Side Diff comparison */}
            <div>
              <p className="text-xs font-bold text-gray-600 mb-2">Side-by-Side Verification Diff:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-1">
                  <span className="font-bold text-red-800 uppercase tracking-wider text-[10px]">
                    Current / Existing Lexicon
                  </span>
                  <p className="text-gray-700 italic">
                    {selectedContribution.existingContent || 'No existing entry (New tribal term submission)'}
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-xl space-y-1">
                  <span className="font-bold text-green-800 uppercase tracking-wider text-[10px]">
                    Community Suggested Correction
                  </span>
                  <p className="font-bold text-vanisetu-primary">
                    {selectedContribution.suggestedCorrection || selectedContribution.tribalText}
                  </p>
                  <p className="text-gray-700">{selectedContribution.translation}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Review Decision *
                </label>
                <select
                  value={reviewStatusAction}
                  onChange={e => setReviewStatusAction(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                >
                  <option value="approved">Approve & Publish</option>
                  <option value="under_review">Mark Under Review</option>
                  <option value="needs_revision">Request Revision from Contributor</option>
                  <option value="rejected">Reject Submission</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Reviewer Notes / Feedback to Contributor
                </label>
                <textarea
                  rows={3}
                  placeholder="Explain reason for approval, revision request, or rejection..."
                  value={reviewNotes}
                  onChange={e => setReviewNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-vanisetu-primary outline-none"
                />
              </div>

              {reviewStatusAction === 'approved' && (
                <div className="p-4 bg-vanisetu-cream/60 rounded-xl border border-vanisetu-primary/20 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={awardBonusXP}
                      onChange={e => setAwardBonusXP(e.target.checked)}
                      className="rounded text-vanisetu-primary focus:ring-vanisetu-primary"
                    />
                    <span className="text-xs font-medium text-gray-800 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-vanisetu-accent" />
                      Award Contributor Bonus XP & Badge
                    </span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedContribution(null)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 bg-vanisetu-primary text-vanisetu-cream rounded-lg text-sm font-semibold hover:bg-vanisetu-primary-dark shadow disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Confirm Review Decision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
