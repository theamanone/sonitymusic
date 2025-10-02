import { useState, useRef, useCallback, useEffect } from 'react';

export function useScrollHandling(messages: any[], loading: boolean) {
  const [autoScroll, setAutoScroll] = useState(true);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Track scroll position to toggle autoScroll
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollThreshold = 300; // pixels from top

    if (scrollTop < scrollThreshold && !loadingMore && hasMoreMessages) {
      // Load more messages when near top
      // This would be implemented in the main component
    }

    // Check if we should show the "jump to bottom" button
    const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 100;
    setShowJumpToLatest(!isAtBottom);

    // Update auto-scroll state
    const isUserScrollingUp = scrollTop < scrollHeight - clientHeight - 50;
    if (isUserScrollingUp !== !autoScroll) {
      setAutoScroll(!isUserScrollingUp);
    }
  }, [loadingMore, hasMoreMessages, autoScroll]);

  // Auto scroll to bottom only if user is at/near bottom and there are messages
  useEffect(() => {
    if (autoScroll && messages.length > 0) {
      setTimeout(() => {
        const el = scrollContainerRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }, 100);
      setShowJumpToLatest(false);
    } else {
      setShowJumpToLatest(messages.length > 0);
    }
  }, [messages, autoScroll]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      setAutoScroll(true);
    }
  }, []);

  // Auto-focus input when not loading
  useEffect(() => {
    if (!loading) {
      // Focus logic would be handled in the main component
    }
  }, [loading]);

  return {
    autoScroll,
    setAutoScroll,
    showJumpToLatest,
    setShowJumpToLatest,
    loadingMore,
    setLoadingMore,
    hasMoreMessages,
    setHasMoreMessages,
    scrollContainerRef,
    scrollRef,
    handleScroll,
    scrollToBottom
  };
}
