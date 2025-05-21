package com.tyk.readingmarathon.services;

import com.tyk.readingmarathon.entities.MarathonsEntity;
import com.tyk.readingmarathon.mappers.MarathonMapper;
import com.tyk.readingmarathon.results.marathon.MarathonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.tyk.readingmarathon.entities.ReadBooksEntity;
import com.tyk.readingmarathon.entities.UserEntity;
import com.tyk.readingmarathon.mappers.ReadBooksMapper;
import com.tyk.readingmarathon.results.marathon.MainResult;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MarathonService {

    private final MarathonMapper marathonMapper;
    private final ReadBooksMapper readBooksMapper;

    @Autowired
    public MarathonService(MarathonMapper marathonMapper, ReadBooksMapper readBooksMapper) {
        this.marathonMapper = marathonMapper;
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
        Integer activeMarathonIndex = this.marathonMapper.selectActiveMarathonIndexByUserEmail(signedUser.getEmail());
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

        int result = this.marathonMapper.insertMarathon(newMarathon);
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


    public MarathonResult saveMarathons(MarathonsEntity marathon)
    {
        if (marathon == null)
        {
            return MarathonResult.FAILURE;
        }
        MarathonsEntity dbMarathon = this.marathonMapper.selectByUserEmail(marathon.getUserEmail());
        if (dbMarathon == null)
        {
            return MarathonResult.FAILURE;
        }
        dbMarathon.setIndex(marathon.getIndex());
        dbMarathon.setUserEmail(marathon.getUserEmail());
        dbMarathon.setCourseCode(marathon.getCourseCode());
        dbMarathon.setReadCount(marathon.getReadCount());
        dbMarathon.setCreatedAt(dbMarathon.getCreatedAt());
        dbMarathon.setFinishedAt(dbMarathon.getFinishedAt());
        return this.marathonMapper.update(marathon) > 0 ? MarathonResult.SUCCESS : MarathonResult.FAILURE;
    }

    public MarathonResult deleteMarathons(MarathonsEntity marathon)
    {
        if (marathon == null)
        {
            return MarathonResult.FAILURE;
        }
        MarathonsEntity dbMarathon = this.marathonMapper.selectByUserEmail(marathon.getUserEmail());
        if (dbMarathon == null)
        {
            return MarathonResult.FAILURE;
        }
        dbMarathon.setDone(false);
        dbMarathon.setIndex(marathon.getIndex()+1);
        dbMarathon.setDeleted(true);
        return this.marathonMapper.update(marathon) > 0 ? MarathonResult.SUCCESS : MarathonResult.FAILURE;
    }

    private String getCourseCodeByBookCount(int count) {
        if (count >= 3 && count <= 5) return "beginner";
        if (count > 5 && count <= 10) return "middle";
        if (count > 10 && count <= 20) return "high";
        if (count > 20 && count <= 50) return "master";
        return null;
    }
}
