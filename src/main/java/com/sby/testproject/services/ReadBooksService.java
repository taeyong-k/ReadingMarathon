package com.sby.testproject.services;

import com.sby.testproject.entities.MarathonsEntity;
import com.sby.testproject.entities.ReadBooksEntity;
import com.sby.testproject.entities.UserEntity;
import com.sby.testproject.mappers.MarathonMapper;
import com.sby.testproject.mappers.ReadBooksMapper;
import com.sby.testproject.results.marathon.ReadBooksResult;
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
