import { useState, useCallback, useEffect } from "react";
import { apiFetch, USE_MOCK } from "../api/config";

// ── Mock persistence via localStorage ──────────────────
const MOCK_KEY = "mos_whitelist_mock";

function getMockState() {
  try {
    const stored = localStorage.getItem(MOCK_KEY);
    return stored ? JSON.parse(stored) : { isEnabled: true, emails: [] };
  } catch {
    return { isEnabled: true, emails: [] };
  }
}

function setMockState(next) {
  try {
    localStorage.setItem(MOCK_KEY, JSON.stringify(next));
  } catch {}
}

export function useWhitelist() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // ── Fetch setting + email list ──────────────────────
  const fetchWhitelist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300));
        const state = getMockState();
        setIsEnabled(state.isEnabled);
        setEmails([...state.emails]);
        return;
      }
      const data = await apiFetch("/email-whitelist");
      setIsEnabled(data?.isEnabled ?? false);
      setEmails(data?.emails ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWhitelist(); }, [fetchWhitelist]);

  // ── Toggle enabled/disabled ─────────────────────────
  const updateSetting = useCallback(async (enabled) => {
    setSaving(true);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 200));
        const state = getMockState();
        setMockState({ ...state, isEnabled: enabled });
        setIsEnabled(enabled);
        return;
      }
      await apiFetch("/email-whitelist/setting", {
        method: "PUT",
        body: JSON.stringify({ isEnabled: enabled }),
      });
      setIsEnabled(enabled);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  // ── Add a single email ──────────────────────────────
  const addEmail = useCallback(async (email) => {
    const normalized = email.trim().toLowerCase();

    setSaving(true);
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 200));
        const state = getMockState();
        if (state.emails.includes(normalized)) return;
        const next = { ...state, emails: [...state.emails, normalized] };
        setMockState(next);
        setEmails([...next.emails]);
        return;
      }
      await apiFetch("/email-whitelist", {
        method: "POST",
        body: JSON.stringify({ email: normalized }),
      });
      setEmails((prev) => [...prev, normalized]);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const removeEmail = useCallback(async (item) => {
  setSaving(true);

  try {
    if (USE_MOCK) {
      const state = getMockState();

      const next = {
        ...state,
        emails: state.emails.filter(
          (e) => e.id !== item.id
        ),
      };

      setMockState(next);
      setEmails(next.emails);
      return;
    }

    await apiFetch(`/email-whitelist/${item.id}`, {
      method: "DELETE",
    });

    setEmails((prev) =>
      prev.filter((e) => e.id !== item.id)
    );
  } catch (err) {
    setError(err.message);
    throw err;
  } finally {
    setSaving(false);
  }
}, []);

  return {
    isEnabled,
    emails,
    loading,
    saving,
    error,
    fetchWhitelist,
    updateSetting,
    addEmail,
    removeEmail,
  };
}