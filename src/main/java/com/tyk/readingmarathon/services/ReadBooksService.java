package com.tyk.readingmarathon.services;

import com.tyk.readingmarathon.entities.MarathonsEntity;
import com.tyk.readingmarathon.entities.ReadBooksEntity;
import com.tyk.readingmarathon.mappers.MarathonMapper;
import com.tyk.readingmarathon.mappers.ReadBooksMapper;
import com.tyk.readingmarathon.results.marathon.ReadBooksResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReadBooksService {
    private final ReadBooksMapper readBooksMapper;
    private final MarathonMapper marathonMapper;

    @Autowired
    public ReadBooksService(ReadBooksMapper readBooksMapper, MarathonMapper marathonMapper) {
        this.readBooksMapper = readBooksMapper;
        this.marathonMapper = marathonMapper;
    }

    public ReadBooksEntity[] getReadBooks(String email)
    {
        Integer marathonIndex = marathonMapper.selectActiveMarathonIndexByUserEmail(email);

        if (marathonIndex == null) {
            // 진행 중인 마라톤이 없으면 빈 배열 반환
            return new ReadBooksEntity[0];
        }

        return this.readBooksMapper.selectAllByIndex(marathonIndex);
    }

    public ReadBooksResult updateReadBooks(ReadBooksEntity readBooks, MarathonsEntity marathon)
    {
        if (readBooks == null)
        {
            return ReadBooksResult.FAILURE;
        }
        ReadBooksEntity dbReadBooks = this.readBooksMapper.selectByIndex(marathon.getIndex());
        if (dbReadBooks == null)
        {
            return ReadBooksResult.FAILURE;
        }
        dbReadBooks.setIsbn(readBooks.getIsbn());
        dbReadBooks.setTitle(readBooks.getTitle());
        dbReadBooks.setAuthor(readBooks.getAuthor());
        dbReadBooks.setPublisher(readBooks.getPublisher());
        dbReadBooks.setThumbnail(readBooks.getThumbnail());
        return this.readBooksMapper.update(readBooks) > 0 ? ReadBooksResult.SUCCESS : ReadBooksResult.FAILURE;
    }

}
