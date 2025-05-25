package com.tyk.readingmarathon.services;

import com.tyk.readingmarathon.entitites.MarathonsEntity;
import com.tyk.readingmarathon.entitites.ReadBooksEntity;
import com.tyk.readingmarathon.entitites.UserEntity;
import com.tyk.readingmarathon.mappers.MarathonsMapper;
import com.tyk.readingmarathon.mappers.ReadBooksMapper;
import com.tyk.readingmarathon.results.marathon.MainResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MarathonService {
    private final MarathonsMapper marathonsMapper;
    private final ReadBooksMapper readBooksMapper;

    @Autowired
    public MarathonService(MarathonsMapper marathonMapper, ReadBooksMapper readBooksMapper) {
        this.marathonsMapper = marathonMapper;
        this.readBooksMapper = readBooksMapper;
    }

    public MainResult startMarathon(UserEntity signedUser, List<ReadBooksEntity> books) {
        // 로그인 정보 관련 유효성 검사 로직
        if (signedUser == null) {
            return MainResult.FAILURE_SESSION_EXPIRED;
        }

        if (books == null || books.size() < 3) {
            return MainResult.FAILURE_INSUFFICIENT_BOOKS;
        }

        // 기존 마라톤 여부 확인
        Integer activeMarathonIndex = this.marathonsMapper.selectActiveMarathonIndexByUserEmail(signedUser.getEmail());
        if (activeMarathonIndex != null) {
            return MainResult.FAILURE_ALREADY_ACTIVE;   // 이미 진행 중인 마라톤 있음 → 중복 생성 방지
        }

        // 마라톤 생성
        MarathonsEntity newMarathon = new MarathonsEntity();
        newMarathon.setUserEmail(signedUser.getEmail());
        newMarathon.setCourseCode(getCourseCodeByBookCount(books.size()));
        newMarathon.setReadCount(0);
        newMarathon.setDone(false);
        newMarathon.setCreatedAt(LocalDateTime.now());
        newMarathon.setFinishedAt(null);
        newMarathon.setDeleted(false);

        int result = this.marathonsMapper.insertMarathon(newMarathon);
        if (result <= 0 || newMarathon.getIndex() <= 0) {
            return MainResult.FAILURE;
        }

        int marathonIndex = newMarathon.getIndex();

        for (ReadBooksEntity book : books) {
            book.setMarathonIndex(marathonIndex);
            if (book.getIsbn() == null || book.getIsbn().trim().isEmpty() ||
                    book.getTitle() == null || book.getTitle().trim().isEmpty() ||
                    book.getAuthor() == null || book.getAuthor().trim().isEmpty() ||
                    book.getPublisher() == null || book.getPublisher().trim().isEmpty() ||
                    book.getThumbnail() == null || book.getThumbnail().trim().isEmpty()) {
                return MainResult.FAILURE_INVALID_BOOK_DATA;
            }
            if (this.readBooksMapper.insertBook(book) <= 0) {
                return MainResult.FAILURE;
            }
        }

        return MainResult.SUCCESS;
    }

    private String getCourseCodeByBookCount(int count) {
        if (count >= 3 && count <= 5) return "beginner";
        if (count > 5 && count <= 10) return "middle";
        if (count > 10 && count <= 20) return "high";
        if (count > 20 && count <= 50) return "master";
        return null;
    }
}


