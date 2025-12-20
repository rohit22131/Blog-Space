import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    styled,
    Paper
} from '@mui/material';
import { categories } from '../../constants/data';

const Wrapper = styled(Paper)`
    padding: 16px 0;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    background: #fff;
`;

const StyledTable = styled(Table)`
    width: 100%;
`;

const CategoryCell = styled(TableCell)`
    padding: 0;
    border-bottom: 1px solid #f0f0f0;
`;

const HeaderCell = styled(TableCell)`
    font-size: 16px;
    font-weight: 700;
    color: #111827;
    padding: 14px 20px;
    border-bottom: 1px solid #e5e7eb;
`;

const StyledLink = styled('div')(({ active }) => ({
    cursor: 'pointer',
    padding: '14px 20px',
    fontSize: '15px',
    borderRadius: '6px',
    transition: 'all 0.25s ease',
    color: active ? '#e63946' : '#111827',
    backgroundColor: active ? '#ffe0e0' : 'transparent',
    '&:hover': {
        backgroundColor: '#ffebee',
        color: '#e63946'
    }
}));

const Categories = ({ selectedCategory, onSelectCategory }) => {
    return (
        <Wrapper elevation={0}>
            <StyledTable>
                {/* ✅ TABLE HEADER */}
                <TableHead>
                    <TableRow>
                        <HeaderCell>Categories</HeaderCell>
                    </TableRow>
                </TableHead>

                {/* ✅ TABLE BODY */}
                <TableBody>
                    {/* Show All */}
                    <TableRow>
                        <CategoryCell>
                            <StyledLink
                                active={!selectedCategory}
                                onClick={() => onSelectCategory('')}
                            >
                                Show All Posts
                            </StyledLink>
                        </CategoryCell>
                    </TableRow>

                    {/* Category List */}
                    {categories.map(item => (
                        <TableRow key={item.id}>
                            <CategoryCell>
                                <StyledLink
                                    active={selectedCategory === item.type}
                                    onClick={() => onSelectCategory(item.type)}
                                >
                                    {item.type}
                                </StyledLink>
                            </CategoryCell>
                        </TableRow>
                    ))}
                </TableBody>
            </StyledTable>
        </Wrapper>
    );
};

export default Categories;
