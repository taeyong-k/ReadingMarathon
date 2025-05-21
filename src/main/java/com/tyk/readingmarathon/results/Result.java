package com.tyk.readingmarathon.results;

public interface Result {
    String toString();

    default String toStringLower() {
        return this.toString().toLowerCase();
    }
}
